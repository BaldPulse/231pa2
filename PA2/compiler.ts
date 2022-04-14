import wabt from 'wabt';
import {Stmt, Expr, Type, Op, Uop} from './ast';
import {parseProgram} from './parser';
import { tcProgram } from './tc';

type Env = Map<string, boolean>;
var LoopLabel : number = 1

function variableNames(stmts: Stmt<Type>[]) : string[] {
  const vars : Array<string> = [];
  stmts.forEach((stmt) => {
    if(stmt.tag === "vardef") { vars.push(stmt.name); }
  });
  return vars;
}
function funs(stmts: Stmt<Type>[]) : Stmt<Type>[] {
  return stmts.filter(stmt => stmt.tag === "define");
}
function nonFuns(stmts: Stmt<Type>[]) : Stmt<Type>[] {
  return stmts.filter(stmt => stmt.tag !== "define");
}
function varsFunsStmts(stmts: Stmt<Type>[]) : [string[], Stmt<Type>[], Stmt<Type>[]] {
  return [variableNames(stmts), funs(stmts), nonFuns(stmts)];
}

export async function run(watSource : string, config: any) : Promise<number> {
  const wabtApi = await wabt();

  const parsed = wabtApi.parseWat("example", watSource);
  const binary = parsed.toBinary({});
  const wasmModule = await WebAssembly.instantiate(binary.buffer, config);
  return (wasmModule.instance.exports as any)._start();
}

export function opStmts(op : Op): Array<string> {
  //+ | - | * | // | % | == | != | <= | >= | < | > | is  
  switch(op) {
    case "+": return [`i32.add`];
    case "-": return [`i32.sub`];
    case "*": return [`i32.mul`];
    case "//": return [`i32.div_s`];
    case "%": return [`i32.rem_s`];
    case "==": return [`i32.eq`];
    case "!=": return [`i32.ne`];
    case "<=": return [`i32.le_s`];
    case ">=": return [`i32.ge_s`];
    case "<": return [`i32.lt_s`];
    case ">": return [`i32.gt_s`];
    default:
      throw new Error(`Unhandled or unknown op: ${op}`);
  }
}

export function uopStmts(uop : Uop, oprdCode:Array<string>): Array<string> {
  switch(uop) {
    case "not": return [...oprdCode, `i32.eqz`];
    case "-": return [`(i32.const 0)`, ...oprdCode, `i32.sub`]
  }
}
export function codeGenExpr(expr : Expr<Type>, locals : Env) : Array<string> {
  switch(expr.tag) {
    case "number": return [`(i32.const ${expr.value})`];
    case "true": return [`(i32.const 1)`];
    case "false": return [`(i32.const 0)`];
    case "id":
      // Since we type-checked for making sure all variable exist, here we
      // just check if it's a local variable and assume it is global if not
      if(locals.has(expr.name)) { return [`(local.get $${expr.name})`]; }
      else { return [`(global.get $${expr.name})`]; }
    case "binop": {
      const lhsExprs = codeGenExpr(expr.lhs, locals);
      const rhsExprs = codeGenExpr(expr.rhs, locals);
      const opstmts = opStmts(expr.op);
      return [...lhsExprs, ...rhsExprs, ...opstmts];
    }
    case "uniop": {
      const oprdExprs = codeGenExpr(expr.oprd, locals);
      const uopstmts = uopStmts(expr.uop, oprdExprs);
      return uopstmts;
    }
    case "parenthesized": {
      const contExpr = codeGenExpr(expr.content, locals);
      return contExpr;
    }
    case "call":
      const valStmts = expr.args.map(e => codeGenExpr(e, locals)).flat();
      let toCall = expr.name;
      if(expr.name === "print") {
        switch(expr.args[0].a) {
          case "bool": toCall = "print_bool"; break;
          case "int": toCall = "print_num"; break;
          case "none": toCall = "print_none"; break;
        }
      }
      valStmts.push(`(call $${toCall})`);
      return valStmts;
    default:
      return [''];
  }
}
export function codeGenStmt(stmt : Stmt<Type>, locals : Env) : Array<string> {
  switch(stmt.tag) {
    case "define":
      const withParamsAndVariables = new Map<string, boolean>(locals.entries());

      // Construct the environment for the function body
      const variables = variableNames(stmt.body);
      variables.forEach(v => withParamsAndVariables.set(v, true));
      stmt.params.forEach(p => withParamsAndVariables.set(p.name, true));

      // Construct the code for params and variable declarations in the body
      const params = stmt.params.map(p => `(param $${p.name} i32)`).join(" ");
      const varDecls = variables.map(v => `(local $${v} i32)`).join("\n");

      const stmts = stmt.body.map(s => codeGenStmt(s, withParamsAndVariables)).flat();
      const stmtsBody = stmts.join("\n");
      return [`(func $${stmt.name} ${params} (result i32)
        (local $scratch i32)
        ${varDecls}
        ${stmtsBody}
        (i32.const 0))`];
    case "if":
      var ifCode = ``;
      for (let i=0; i<stmt.ifs.length; i++){
        if(i==0){
          let cond = codeGenExpr(stmt.ifs[i].condition, locals).flat();
          const condCode = cond.join("\n");
          let ifbody = stmt.ifs[i].body.map(s => codeGenStmt(s, locals)).flat();
          const bodyCode = ifbody.join("\n");
          let exifCode=(
          `
          ${condCode}
          (if\n
            (then\n
              ${bodyCode}
            )
          `)
          ifCode = [ifCode, exifCode].flat().join("\n");
        }
        else{
          let cond = codeGenExpr(stmt.ifs[i].condition, locals).flat();
          const condCode = cond.join("\n");
          let ifbody = stmt.ifs[i].body.map(s => codeGenStmt(s, locals)).flat();
          const bodyCode = ifbody.join("\n");
          let exifCode=(
          `
          (else
          ${condCode}
          (if
          (then
            ${bodyCode}
          )
          `)
          ifCode = [ifCode, exifCode].flat().join("\n");
        }
      }
      if("else" in stmt){
        let elsebody = stmt.else.map(s => codeGenStmt(s, locals)).flat();
        const bodyCode = elsebody.join("\n");
        let exifCode=(
        `
        (else
          ${bodyCode}
        )
        `
        )
        ifCode = [ifCode, exifCode].flat().join("\n");
      }
      ifCode= [ifCode, `)`.repeat(stmt.ifs.length*2-2), `)`].flat().join("");
      return [ifCode];
    
    case "while":
      let looplabel = "loop" + LoopLabel.toString();
      let blocklabel = "block" + LoopLabel.toString();
      let whilecond = codeGenExpr(stmt.condition, locals).flat();
      const whilecondCode = whilecond.join("\n");
      let whilebody = stmt.body.map(s => codeGenStmt(s, locals)).flat();
      const whilebodyCode = whilebody.join("\n");
      let whileCode = `
      (block $${blocklabel}
        (loop $${looplabel}
          ${whilecondCode}
          i32.eqz
          br_if $${blocklabel}
          ${whilebodyCode}
          br $${looplabel}
        )
      )
      `;
      return [whileCode];
    case "while":
      return ["nop\n"];
    case "return":
      var valStmts = codeGenExpr(stmt.value, locals);
      valStmts.push("return");
      return valStmts;
    case "assign":
      var valStmts = codeGenExpr(stmt.value, locals);
      if(locals.has(stmt.name)) { valStmts.push(`(local.set $${stmt.name})`); }
      else { valStmts.push(`(global.set $${stmt.name})`); }
      return valStmts;
    case "vardef":
      var valStmts = codeGenExpr(stmt.value, locals);
      if(locals.has(stmt.name)) { valStmts.push(`(local.set $${stmt.name})`); }
      else { valStmts.push(`(global.set $${stmt.name})`); }
      return valStmts;
    case "expr":
      const result = codeGenExpr(stmt.expr, locals);
      result.push("(local.set $scratch)");
      return result;
  }
}
export function compile(source : string) : string {
  let ast = parseProgram(source);
  ast = tcProgram(ast);
  const emptyEnv = new Map<string, boolean>();
  const [vars, funs, stmts] = varsFunsStmts(ast);
  const funsCode : string[] = funs.map(f => codeGenStmt(f, emptyEnv)).map(f => f.join("\n"));
  const allFuns = funsCode.join("\n\n");
  const varDecls = vars.map(v => `(global $${v} (mut i32) (i32.const 0))`).join("\n");

  const allStmts = stmts.map(s => codeGenStmt(s, emptyEnv)).flat();

  const main = [`(local $scratch i32)`, ...allStmts].join("\n");

  const lastStmt = ast[ast.length - 1];
  const isExpr = lastStmt.tag === "expr";
  var retType = "";
  var retVal = "";
  if(isExpr) {
    retType = "(result i32)";
    retVal = "(local.get $scratch)"
  }

  return `
    (module
      (func $print_num (import "imports" "print_num") (param i32) (result i32))
      (func $print_bool (import "imports" "print_bool") (param i32) (result i32))
      (func $print_none (import "imports" "print_none")  (result i32))
      ${varDecls}
      ${allFuns}
      (func (export "_start") ${retType}
        ${main}
        ${retVal}
      )
    ) 
  `;
}