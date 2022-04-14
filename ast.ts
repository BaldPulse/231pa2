export type Type =
  | "int"
  | "bool"
  | "none"

export type Parameter =
  | { name: string, typ: Type }

export type Stmt<A> =
  | { a?: A, tag: "assign", name: string, value: Expr<A> }
  | { a?: A, tag: "vardef", name: string, value: Expr<A>, type: Type }
  | { a?: A, tag: "if", ifs: Ifstmt<A>[], else?: Stmt<A>[]}
  | { a?: A, tag: "while", condition: Expr<A>, body: Stmt<A>[]}
  | { a?: A, tag: "expr", expr: Expr<A> }
  | { a?: A, tag: "define", name: string, params: Parameter[], ret: Type, body: Stmt<A>[] }
  | { a?: A, tag: "return", value: Expr<A> }

export type Ifstmt<A> =
  {a?: A, tag: "subif", condition: Expr<A>, body: Stmt<A>[]}

export type Expr<A> = 
  //begin "literals"
  | { a?: A, tag: "number", value: number }
  | { a?: A, tag: "true" }
  | { a?: A, tag: "false" }
  | { a?: A, tag: "none" }
  //end "literals"
  | { a?: A, tag: "uniop", uop: Uop, oprd: Expr<A>}
  | { a?: A, tag: "binop", op: Op, lhs: Expr<A>, rhs: Expr<A> }
  | { a?: A, tag: "parenthesized", content: Expr<A> }
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
const uops = {"not": true, "-": true};
export type Uop = keyof (typeof uops);
export function isUop(maybeUop : string) : maybeUop is Uop {
  return maybeUop in uops;
}

