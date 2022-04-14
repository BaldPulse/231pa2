"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tcProgram = exports.tcSubif = exports.tcStmt = exports.tcExpr = void 0;
var ast_1 = require("./ast");
var inDefine = false;
function tcExpr(e, functions, variables) {
    switch (e.tag) {
        case "number": return __assign(__assign({}, e), { a: "int" });
        case "true": return __assign(__assign({}, e), { a: "bool" });
        case "false": return __assign(__assign({}, e), { a: "bool" });
        case "none": return __assign(__assign({}, e), { a: "none" });
        case "binop": {
            e.lhs = tcExpr(e.lhs, functions, variables);
            e.rhs = tcExpr(e.rhs, functions, variables);
            switch (e.op) {
                case "+":
                    if (e.lhs.a != "int" || e.rhs.a != "int") {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "int" });
                case "-":
                    if (e.lhs.a != "int" || e.rhs.a != "int") {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "int" });
                case "*":
                    if (e.lhs.a != "int" || e.rhs.a != "int") {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "int" });
                case "//":
                    if (e.lhs.a != "int" || e.rhs.a != "int") {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "int" });
                case "%":
                    if (e.lhs.a != "int" || e.rhs.a != "int") {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "int" });
                case "==":
                    if (!((e.lhs.a == "int" && e.rhs.a == "int") || (e.lhs.a == "bool" && e.rhs.a == "bool"))) {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "bool" });
                case "!=":
                    if (!((e.lhs.a == "int" && e.rhs.a == "int") || (e.lhs.a == "bool" && e.rhs.a == "bool"))) {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "bool" });
                case "<=":
                    if (!(e.lhs.a == "int" && e.rhs.a == "int")) {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "bool" });
                case ">=":
                    if (!(e.lhs.a == "int" && e.rhs.a == "int")) {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "bool" });
                case "<":
                    if (!(e.lhs.a == "int" && e.rhs.a == "int")) {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "bool" });
                case ">":
                    if (!(e.lhs.a == "int" && e.rhs.a == "int")) {
                        throw new Error("Invalid Operands for " + e.op);
                    }
                    return __assign(__assign({}, e), { a: "bool" });
                default: throw new Error("Unhandled op " + e.op);
            }
        }
        case "uniop": {
            e.oprd = tcExpr(e.oprd, functions, variables);
            switch (e.uop) {
                case "not":
                    if (e.oprd.a != "bool") {
                        throw new Error("Invalid Operand for " + e.uop);
                    }
                    return __assign(__assign({}, e), { a: "bool" });
                case "-":
                    if (e.oprd.a != "int") {
                        throw new Error("Invalid Operand for " + e.uop);
                    }
                    return __assign(__assign({}, e), { a: "int" });
            }
        }
        case "parenthesized": {
            e.content = tcExpr(e.content, functions, variables);
            return __assign(__assign({}, e), { a: e.content.a });
        }
        case "id": return __assign(__assign({}, e), { a: variables.get(e.name) });
        case "call":
            if (e.name === "print") {
                if (e.args.length !== 1) {
                    throw new Error("print expects a single argument");
                }
                var newArgs_1 = [tcExpr(e.args[0], functions, variables)];
                var res = __assign(__assign({}, e), { a: "none", args: newArgs_1 });
                return res;
            }
            if (!functions.has(e.name)) {
                throw new Error("function " + e.name + " not found");
            }
            var _a = functions.get(e.name), args = _a[0], ret = _a[1];
            if (args.length !== e.args.length) {
                throw new Error("Expected " + args.length + " arguments but got " + e.args.length);
            }
            var newArgs = args.map(function (a, i) {
                var argtyp = tcExpr(e.args[i], functions, variables);
                if (a !== argtyp.a) {
                    throw new Error("Got " + argtyp + " as argument " + (i + 1) + ", expected " + a);
                }
                return argtyp;
            });
            return __assign(__assign({}, e), { a: ret, args: newArgs });
    }
}
exports.tcExpr = tcExpr;
function tcStmt(s, functions, variables, currentReturn) {
    var localvariables = new Map();
    switch (s.tag) {
        case "vardef": {
            if (!ast_1.isLiteral(s.value)) {
                throw new Error("Cannot assign non literal in variable definition");
            }
            var rhs = tcExpr(s.value, functions, variables);
            if (rhs.a != s.type) {
                throw new Error("Cannot assign " + rhs + " to type " + s.type);
            }
            else {
                if (localvariables.has(s.name)) {
                    throw new Error("Duplicate definition of " + s.name + " in same scope");
                }
                localvariables.set(s.name, s.type);
                variables.set(s.name, s.type);
            }
            return __assign(__assign({}, s), { value: rhs });
        }
        case "assign": {
            var rhs = tcExpr(s.value, functions, variables);
            if (variables.has(s.name) && variables.get(s.name) !== rhs.a) {
                throw new Error("Cannot assign " + rhs + " to " + variables.get(s.name));
            }
            else if (!variables.has(s.name)) {
                throw new Error("Assignment before definition " + s.name);
            }
            return __assign(__assign({}, s), { value: rhs });
        }
        case "define": {
            var bodyvars_1 = new Map(variables.entries());
            s.params.forEach(function (p) { bodyvars_1.set(p.name, p.typ); });
            var newStmts = s.body.map(function (bs) { return tcStmt(bs, functions, bodyvars_1, s.ret); });
            var haveReturn = false;
            for (var _i = 0, newStmts_1 = newStmts; _i < newStmts_1.length; _i++) {
                var bstmt = newStmts_1[_i];
                if (bstmt.tag == "return") {
                    haveReturn = true;
                }
                if (bstmt.tag == "if") {
                    if ("r" in bstmt) {
                        if (bstmt.r == s.ret)
                            haveReturn = true;
                    }
                }
            }
            if (!haveReturn && s.ret != "none") {
                throw new Error("Function with return type specified must return");
            }
            return __assign(__assign({}, s), { body: newStmts });
        }
        case "if": {
            var newifs = [];
            for (var _a = 0, _b = s.ifs; _a < _b.length; _a++) {
                var i = _b[_a];
                newifs.push(tcSubif(i, functions, variables, currentReturn));
            }
            if ('else' in s) {
                var newelse = s.else.map(function (bs) { return tcStmt(bs, functions, variables, currentReturn); });
                for (var _c = 0, newelse_1 = newelse; _c < newelse_1.length; _c++) {
                    var part = newelse_1[_c];
                    if (part.tag == "return") {
                        s.r = part.a;
                        for (var _d = 0, _e = s.ifs; _d < _e.length; _d++) {
                            var sif = _e[_d];
                            if ("r" in sif) {
                                if (sif.r != s.r) {
                                    s.r = "none";
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
                return __assign(__assign({}, s), { ifs: newifs, else: newelse });
            }
            return __assign(__assign({}, s), { ifs: newifs });
        }
        case "while": {
            var newbody = s.body.map(function (bs) { return tcStmt(bs, functions, variables, currentReturn); });
            return __assign(__assign({}, s), { condition: tcExpr(s.condition, functions, variables), body: newbody });
        }
        case "expr": {
            var ret = tcExpr(s.expr, functions, variables);
            return __assign(__assign({}, s), { expr: ret });
        }
        case "return": {
            var valTyp = tcExpr(s.value, functions, variables);
            if (valTyp.a !== currentReturn) {
                throw new Error(valTyp + " returned but " + currentReturn + " expected.");
            }
            return __assign(__assign({}, s), { value: valTyp, a: valTyp.a });
        }
    }
}
exports.tcStmt = tcStmt;
function tcSubif(i, functions, variables, currentReturn) {
    i.condition = tcExpr(i.condition, functions, variables);
    if (i.condition.a != "bool") {
        throw new Error("Conditional statement not typed boolean");
    }
    var newbody = i.body.map(function (bs) { return tcStmt(bs, functions, variables, currentReturn); });
    for (var _i = 0, newbody_1 = newbody; _i < newbody_1.length; _i++) {
        var part = newbody_1[_i];
        if (part.tag == "return") {
            i.r = part.a;
            break;
        }
    }
    for (var _a = 0, _b = i.body; _a < _b.length; _a++) {
        var istmt = _b[_a];
        if (istmt.tag == "vardef") {
            throw new Error("Variable definition in If block");
        }
    }
    return __assign(__assign({}, i), { body: newbody });
}
exports.tcSubif = tcSubif;
function tcProgram(p) {
    var functions = new Map();
    p.forEach(function (s) {
        if (s.tag === "define") {
            functions.set(s.name, [s.params.map(function (p) { return p.typ; }), s.ret]);
        }
    });
    var globals = new Map();
    return p.map(function (s) {
        if (s.tag === "vardef") {
            if (!ast_1.isLiteral(s.value)) {
                throw new Error("Cannot assign non literal in variable definition");
            }
            var rhs = tcExpr(s.value, functions, globals);
            if (rhs.a != s.type) {
                throw new Error("Cannot assign " + rhs + " to type " + s.type);
            }
            else {
                if (globals.has(s.name)) {
                    throw new Error("Duplicate definition of " + s.name + " in same scope");
                }
            }
            globals.set(s.name, rhs.a);
            return __assign(__assign({}, s), { value: rhs });
        }
        else {
            var res = tcStmt(s, functions, globals, "none");
            return res;
        }
    });
}
exports.tcProgram = tcProgram;
