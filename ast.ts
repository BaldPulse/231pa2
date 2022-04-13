export type Type =
  | "int"
  | "bool"
  | "none"

export type Parameter =
  | { name: string, typ: Type }

export type Stmt<A> =
  | { a?: A, tag: "assign", name: string, value: Expr<A> }
  | { a?: A, tag: "vardef", name: string, value: Expr<A>, type: Type }
  | { a?: A, tag: "expr", expr: Expr<A> }
  | { a?: A, tag: "define", name: string, params: Parameter[], ret: Type, body: Stmt<A>[] }
  | { a?: A, tag: "return", value: Expr<A> }

export type Expr<A> = 
  | { a?: A, tag: "number", value: number }
  | { a?: A, tag: "true" }
  | { a?: A, tag: "false" }
  | { a?: A, tag: "none" }
  | { a?: A, tag: "binop", op: Op, lhs: Expr<A>, rhs: Expr<A> }
  | { a?: A, tag: "id", name: string, global?: boolean }
  | { a?: A, tag: "call", name: string, args: Expr<A>[] }

  export function isLiteral(maybeLit : Expr<any>) {
    var tag = maybeLit.tag;
    if (tag==="number" || tag==="true" || tag==="false" || tag==="none"){
      return true;
    }
    else {
      return false;
    }
  }

const ops = {"+": true, "-": true, "*": true, "//": true, "%": true, "==": true, "!=": true, 
            "<=": true, ">=": true, "<": true, ">": true, "is": true};
export type Op = keyof (typeof ops);
export function isOp(maybeOp : string) : maybeOp is Op {
  return maybeOp in ops;
}

