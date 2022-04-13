import { assert } from "console";
import { Expr, isLiteral, Stmt, Type } from "./ast";

type FunctionsEnv = Map<string, [Type[], Type]>;
type BodyEnv = Map<string, Type>;

export function tcExpr(e : Expr<any>, functions : FunctionsEnv, variables : BodyEnv) : Expr<Type> {
  switch(e.tag) {
    case "number": return { ...e, a: "int" };
    case "true": return { ...e, a: "bool" };
    case "false": return { ...e, a: "bool" };
    case "none": return { ...e, a: "none" };
    case "binop": {
      e.lhs = tcExpr(e.lhs, functions, variables);
      e.rhs = tcExpr(e.rhs, functions, variables);
      switch(e.op) {
        case "+": 
          if (e.lhs.a!="int" || e.rhs.a!="int"){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "int" };
        case "-": 
          if (e.lhs.a!="int" || e.rhs.a!="int"){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "int" };
        case "*": 
          if (e.lhs.a!="int" || e.rhs.a!="int"){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "int" };
        case "//":
          if (e.lhs.a!="int" || e.rhs.a!="int"){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "int" };
        case "%":
          if (e.lhs.a!="int" || e.rhs.a!="int"){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "int" };
        case "==":
          if (!((e.lhs.a=="int" && e.rhs.a=="int") || (e.lhs.a=="bool" && e.rhs.a=="bool"))){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "bool" };
        case "!=":
          if (!((e.lhs.a=="int" && e.rhs.a=="int") || (e.lhs.a=="bool" && e.rhs.a=="bool"))){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "bool" };
        case "<=":
          if (!(e.lhs.a=="int" && e.rhs.a=="int")){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "bool" };
        case ">=":
          if (!(e.lhs.a=="int" && e.rhs.a=="int")){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "bool" };
        case "<": 
          if (!(e.lhs.a=="int" && e.rhs.a=="int")){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "bool" };
        case ">": 
          if (!(e.lhs.a=="int" && e.rhs.a=="int")){
            throw new Error(`Invalid Operands for ${e.op}`);
          }
          return { ...e, a: "bool" };
        default: throw new Error(`Unhandled op ${e.op}`);
      }
    }
    case "uniop": {
      e.oprd = tcExpr(e.oprd, functions, variables);
      switch (e.uop){
        case "not":
          if (e.oprd.a !="bool"){
            throw new Error(`Invalid Operand for ${e.uop}`);
          }
          return { ...e, a: "bool" };
        case "-":
          if (e.oprd.a != "int"){
            throw new Error(`Invalid Operand for ${e.uop}`)
          }
          return { ...e, a: "int" };
        }
    }
    case "parenthesized": {
      e.content = tcExpr(e.content, functions, variables);
      return {...e, a:e.content.a}
    }
    case "id": return { ...e, a: variables.get(e.name) };
    case "call":
      if(e.name === "print") {
        if(e.args.length !== 1) { throw new Error("print expects a single argument"); }
        const newArgs = [tcExpr(e.args[0], functions, variables)];
        const res : Expr<Type> = { ...e, a: "none", args: newArgs } ;
        return res;
      }
      if(!functions.has(e.name)) {
        throw new Error(`function ${e.name} not found`);
      }

      const [args, ret] = functions.get(e.name);
      if(args.length !== e.args.length) {
        throw new Error(`Expected ${args.length} arguments but got ${e.args.length}`);
      }

      const newArgs = args.map((a, i) => {
        const argtyp = tcExpr(e.args[i], functions, variables);
        if(a !== argtyp.a) { throw new Error(`Got ${argtyp} as argument ${i + 1}, expected ${a}`); }
        return argtyp
      });

      return { ...e, a: ret, args: newArgs };
  }
}


export function tcStmt(s : Stmt<any>, functions : FunctionsEnv, variables : BodyEnv, currentReturn : Type) : Stmt<Type> {
  switch(s.tag) {
    case "vardef": {
      //TODO type check vardef
      if(! isLiteral(s.value)){
        throw new Error(`Cannot assign non literal in variable definition`);
      }
      const rhs = tcExpr(s.value, functions, variables);
      if (rhs.a != s.type) {
        throw new Error(`Cannot assign ${rhs} to type ${s.type}`);
      }
      else{
        variables.set(s.name, s.type)
      }
      return { ...s, value: rhs};
    }
    case "assign": {
      const rhs = tcExpr(s.value, functions, variables);
      if(variables.has(s.name) && variables.get(s.name) !== rhs.a) {
        throw new Error(`Cannot assign ${rhs} to ${variables.get(s.name)}`);
      }
      else {
        variables.set(s.name, rhs.a);
      }
      return { ...s, value: rhs };
    }
    case "define": {
      const bodyvars = new Map<string, Type>(variables.entries());
      s.params.forEach(p => { bodyvars.set(p.name, p.typ)});
      const newStmts = s.body.map(bs => tcStmt(bs, functions, bodyvars, s.ret));
      return { ...s, body: newStmts };
    }
    case "expr": {
      const ret = tcExpr(s.expr, functions, variables);
      return { ...s, expr: ret };
    }
    case "return": {
      const valTyp = tcExpr(s.value, functions, variables);
      if(valTyp.a !== currentReturn) {
        throw new Error(`${valTyp} returned but ${currentReturn} expected.`);
      }
      return { ...s, value: valTyp };
    }
  }
}

export function tcProgram(p : Stmt<any>[]) : Stmt<Type>[] {
  const functions = new Map<string, [Type[], Type]>();
  p.forEach(s => {
    if(s.tag === "define") {
      functions.set(s.name, [s.params.map(p => p.typ), s.ret]);
    }
  });

  const globals = new Map<string, Type>();
  return p.map(s => {
    if(s.tag === "assign") {
      const rhs = tcExpr(s.value, functions, globals);
      globals.set(s.name, rhs.a);
      return { ...s, value: rhs };
    }
    else {
      const res = tcStmt(s, functions, globals, "none");
      return res;
    }
  });
}