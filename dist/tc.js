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
exports.tcProgram = exports.tcStmt = exports.tcExpr = void 0;
function tcExpr(e, functions, variables) {
    switch (e.tag) {
        case "number": return __assign(__assign({}, e), { a: "int" });
        case "true": return __assign(__assign({}, e), { a: "bool" });
        case "false": return __assign(__assign({}, e), { a: "bool" });
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
                case ">": return __assign(__assign({}, e), { a: "bool" });
                default: throw new Error("Unhandled op " + e.op);
            }
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
    switch (s.tag) {
        case "assign": {
            var rhs = tcExpr(s.value, functions, variables);
            if (variables.has(s.name) && variables.get(s.name) !== rhs.a) {
                throw new Error("Cannot assign " + rhs + " to " + variables.get(s.name));
            }
            else {
                variables.set(s.name, rhs.a);
            }
            return __assign(__assign({}, s), { value: rhs });
        }
        case "define": {
            var bodyvars_1 = new Map(variables.entries());
            s.params.forEach(function (p) { bodyvars_1.set(p.name, p.typ); });
            var newStmts = s.body.map(function (bs) { return tcStmt(bs, functions, bodyvars_1, s.ret); });
            return __assign(__assign({}, s), { body: newStmts });
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
            return __assign(__assign({}, s), { value: valTyp });
        }
    }
}
exports.tcStmt = tcStmt;
function tcProgram(p) {
    var functions = new Map();
    p.forEach(function (s) {
        if (s.tag === "define") {
            functions.set(s.name, [s.params.map(function (p) { return p.typ; }), s.ret]);
        }
    });
    var globals = new Map();
    return p.map(function (s) {
        if (s.tag === "assign") {
            var rhs = tcExpr(s.value, functions, globals);
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
