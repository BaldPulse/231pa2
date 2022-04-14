import { assert } from "console";
import { Expr, Ifstmt, isLiteral, Stmt, Type } from "./ast";

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
  var localvariables = new Map<string, Type>();
  switch(s.tag) {
    case "vardef": {
      if(! isLiteral(s.value)){
        throw new Error(`Cannot assign non literal in variable definition`);
      }
      const rhs = tcExpr(s.value, functions, variables);
      if (rhs.a != s.type) {
        throw new Error(`Cannot assign ${rhs} to type ${s.type}`);
      }
      else{
        if(localvariables.has(s.name)) {
          throw new Error(`Duplicate definition of ${s.name} in same scope`);
        }
        localvariables.set(s.name, s.type)
        variables.set(s.name, s.type)
      }
      return { ...s, value: rhs};
    }
    case "assign": {
      const rhs = tcExpr(s.value, functions, variables);
      if(variables.has(s.name) && variables.get(s.name) !== rhs.a) {
        throw new Error(`Cannot assign ${rhs} to ${variables.get(s.name)}`);
      }
      else if (!variables.has(s.name)) {
        throw new Error(`Assignment before definition ${s.name}`);
      }
      return { ...s, value: rhs };
    }
    case "define": {
      const bodyvars = new Map<string, Type>(variables.entries());
      s.params.forEach(p => { bodyvars.set(p.name, p.typ)});
      const newStmts = s.body.map(bs => tcStmt(bs, functions, bodyvars, s.ret));
      return { ...s, body: newStmts };
    }
    case "if": {
      let newifs = []
      for (let i of s.ifs){
        newifs.push(tcSubif(i, functions, variables, currentReturn));
      }
      if ('else' in s){
        let newelse = s.else.map(bs => tcStmt(bs, functions, variables, currentReturn));
        return {...s, ifs:newifs, else:newelse};
      }
      return {...s, ifs:newifs};
    }
    case "while": {
      let newbody = s.body.map(bs => tcStmt(bs, functions, variables, currentReturn));
      return {...s, condition:tcExpr(s.condition, functions, variables), body:newbody};
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

export function tcSubif(i : Ifstmt<any>, functions : FunctionsEnv, variables : BodyEnv, currentReturn : Type) : Ifstmt<any>{
  i.condition = tcExpr(i.condition, functions, variables);
  if(i.condition.a != "bool"){
    throw new Error("Conditional statement not typed boolean")
  }
  const newbody = i.body.map(bs => tcStmt(bs, functions, variables, currentReturn));
  for (let istmt of i.body){
    if(istmt.tag=="vardef"){
      throw new Error("Variable definition in If block");
    }
  }
  return {...i, body:newbody};
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
    if(s.tag === "vardef") {
      if(! isLiteral(s.value)){
        throw new Error(`Cannot assign non literal in variable definition`);
      }
      const rhs = tcExpr(s.value, functions, globals);
      if (rhs.a != s.type) {
        throw new Error(`Cannot assign ${rhs} to type ${s.type}`);
      }
      else{
        if(globals.has(s.name)) {
          throw new Error(`Duplicate definition of ${s.name} in same scope`);
        }
      }
      globals.set(s.name, rhs.a);
      return { ...s, value: rhs };
    }
    else {
      const res = tcStmt(s, functions, globals, "none");
      return res;
    }
  });
}