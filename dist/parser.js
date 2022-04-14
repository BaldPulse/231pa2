"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseArguments = exports.traverseExpr = exports.traverseParameters = exports.traverseType = exports.traverseAssignment = exports.traverseBody = exports.traverseIf = exports.traverseStmt = exports.traverseStmts = exports.parseProgram = void 0;
var lezer_python_1 = require("lezer-python");
var ast_1 = require("./ast");
function parseProgram(source) {
    var t = lezer_python_1.parser.parse(source).cursor();
    return traverseStmts(source, t);
}
exports.parseProgram = parseProgram;
function traverseStmts(s, t) {
    // The top node in the program is a Script node with a list of children
    // that are various statements
    t.firstChild();
    var stmts = [];
    do {
        stmts.push(traverseStmt(s, t));
    } while (t.nextSibling()); // t.nextSibling() returns false when it reaches
    //  the end of the list of children
    return stmts;
}
exports.traverseStmts = traverseStmts;
/*
  Invariant – t must focus on the same node at the end of the traversal
*/
function traverseStmt(s, t) {
    switch (t.type.name) {
        case "ReturnStatement":
            t.firstChild(); // Focus return keyword
            t.nextSibling(); // Focus expression
            var value = traverseExpr(s, t);
            t.parent();
            return { tag: "return", value: value };
        case "AssignStatement":
            return traverseAssignment(s, t);
        case "IfStatement":
            return traverseIf(s, t);
        case "WhileStatement":
            t.firstChild(); //while
            t.nextSibling(); //condition
            var whilecondition = traverseExpr(s, t);
            t.nextSibling(); //body
            t.firstChild(); //:
            var whilebody = traverseBody(s, t);
            t.parent();
            return { tag: "while", condition: whilecondition, body: whilebody };
        case "PassStatement":
            return { tag: "pass" };
        case "ExpressionStatement":
            t.firstChild(); // The child is some kind of expression, the
            // ExpressionStatement is just a wrapper with no information
            var expr = traverseExpr(s, t);
            t.parent();
            return { tag: "expr", expr: expr };
        case "FunctionDefinition":
            t.firstChild(); // Focus on def
            t.nextSibling(); // Focus on name of function
            var name = s.substring(t.from, t.to);
            t.nextSibling(); // Focus on ParamList
            var params = traverseParameters(s, t);
            t.nextSibling(); // Focus on Body or TypeDef
            var ret = "none";
            var maybeTD = t;
            if (maybeTD.type.name === "TypeDef") {
                t.firstChild();
                ret = traverseType(s, t);
                t.parent();
            }
            t.nextSibling(); // Focus on single statement (for now)
            t.firstChild(); // Focus on :
            var body = [];
            while (t.nextSibling()) {
                body.push(traverseStmt(s, t));
            }
            t.parent(); // Pop to Body
            t.parent(); // Pop to FunctionDefinition
            return {
                tag: "define",
                name: name, params: params, body: body, ret: ret
            };
    }
}
exports.traverseStmt = traverseStmt;
function traverseIf(s, t) {
    var vifs = [];
    t.firstChild();
    do {
        if (t.type.name == "else") {
            t.nextSibling();
            var ebody = traverseBody(s, t);
            t.parent();
            return { tag: "if", ifs: vifs, else: ebody };
        }
        else if (t.type.name == "elif" || t.type.name == "if") {
            t.nextSibling();
            var cond = traverseExpr(s, t);
            t.nextSibling();
            var body = traverseBody(s, t);
            var curif = { tag: "subif", condition: cond, body: body };
            vifs.push(curif);
        }
    } while (t.nextSibling());
    t.parent();
    return { tag: "if", ifs: vifs };
}
exports.traverseIf = traverseIf;
function traverseBody(s, t) {
    t.firstChild();
    t.nextSibling();
    var stmts = [];
    do {
        stmts.push(traverseStmt(s, t));
    } while (t.nextSibling()); // t.nextSibling() returns false when it reaches
    //  the end of the list of children
    t.parent();
    return stmts;
}
exports.traverseBody = traverseBody;
function traverseAssignment(s, t) {
    t.firstChild(); // focused on name (the first child)
    var name = s.substring(t.from, t.to);
    t.nextSibling();
    if (t.type.name === "TypeDef") {
        t.firstChild();
        t.nextSibling();
        var type = traverseType(s, t);
        t.parent();
        t.nextSibling();
        t.nextSibling();
        var value = traverseExpr(s, t);
        t.parent();
        return { tag: "vardef", name: name, value: value, type: type };
    }
    t.nextSibling(); // focused on the value expression
    var value = traverseExpr(s, t);
    t.parent();
    return { tag: "assign", name: name, value: value };
}
exports.traverseAssignment = traverseAssignment;
function traverseType(s, t) {
    switch (t.type.name) {
        case "VariableName":
            var name_1 = s.substring(t.from, t.to);
            if (name_1 != "int" && name_1 != "bool") {
                throw new Error("Unknown type: " + name_1);
            }
            return name_1;
        default:
            throw new Error("Unknown type: " + t.type.name);
    }
}
exports.traverseType = traverseType;
function traverseParameters(s, t) {
    t.firstChild(); // Focuses on open paren
    var parameters = [];
    t.nextSibling(); // Focuses on a VariableName
    while (t.type.name !== ")") {
        var name_2 = s.substring(t.from, t.to);
        t.nextSibling(); // Focuses on "TypeDef", hopefully, or "," if mistake
        var nextTagName = t.type.name; // NOTE(joe): a bit of a hack so the next line doesn't if-split
        if (nextTagName !== "TypeDef") {
            throw new Error("Missed type annotation for parameter " + name_2);
        }
        ;
        t.firstChild(); // Enter TypeDef
        t.nextSibling(); // Focuses on type itself
        var typ = traverseType(s, t);
        t.parent();
        t.nextSibling(); // Move on to comma or ")"
        parameters.push({ name: name_2, typ: typ });
        t.nextSibling(); // Focuses on a VariableName
    }
    t.parent(); // Pop to ParamList
    return parameters;
}
exports.traverseParameters = traverseParameters;
function traverseExpr(s, t) {
    switch (t.type.name) {
        case "Boolean":
            if (s.substring(t.from, t.to) === "True") {
                return { tag: "true" };
            }
            else {
                return { tag: "false" };
            }
        case "Number":
            return { tag: "number", value: Number(s.substring(t.from, t.to)) };
        case "None":
            return { tag: "none" };
        case "VariableName":
            return { tag: "id", name: s.substring(t.from, t.to) };
        case "CallExpression":
            t.firstChild(); // Focus name
            var name = s.substring(t.from, t.to);
            t.nextSibling(); // Focus ArgList
            t.firstChild(); // Focus open paren
            var args = traverseArguments(t, s);
            var result = { tag: "call", name: name, args: args };
            t.parent();
            return result;
        case "BinaryExpression":
            t.firstChild(); // go to lhs
            var lhsExpr = traverseExpr(s, t);
            t.nextSibling(); // go to op
            var opStr = s.substring(t.from, t.to);
            if (!ast_1.isOp(opStr)) {
                throw new Error("Unknown or unhandled binary op: " + opStr);
            }
            t.nextSibling(); // go to rhs
            var rhsExpr = traverseExpr(s, t);
            t.parent();
            return {
                tag: "binop",
                op: opStr,
                lhs: lhsExpr,
                rhs: rhsExpr
            };
        case "ParenthesizedExpression":
            t.firstChild();
            t.nextSibling();
            var cont = traverseExpr(s, t);
            t.parent();
            return {
                tag: "parenthesized",
                content: cont
            };
        case "UnaryExpression":
            t.firstChild(); // go to op
            var uopStr = s.substring(t.from, t.to);
            if (!ast_1.isUop(uopStr)) {
                throw new Error("Unknown or unhandled unary op: " + uopStr);
            }
            t.nextSibling(); // go to operand
            var operand = traverseExpr(s, t);
            t.parent();
            return {
                tag: "uniop",
                uop: uopStr,
                oprd: operand
            };
        default:
            return {
                tag: "none"
            };
    }
}
exports.traverseExpr = traverseExpr;
function traverseArguments(c, s) {
    c.firstChild(); // Focuses on open paren
    var args = [];
    c.nextSibling();
    while (c.type.name !== ")") {
        var expr = traverseExpr(s, c);
        args.push(expr);
        c.nextSibling(); // Focuses on either "," or ")"
        c.nextSibling(); // Focuses on a VariableName
    }
    c.parent(); // Pop to ArgList
    return args;
}
exports.traverseArguments = traverseArguments;
