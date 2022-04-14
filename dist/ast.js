"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUop = exports.isOp = exports.isLiteral = void 0;
function isLiteral(maybeLit) {
    var tag = maybeLit.tag;
    if (tag === "number" || tag === "true" || tag === "false" || tag === "none") {
        return true;
    }
    else {
        return false;
    }
}
exports.isLiteral = isLiteral;
var ops = { "+": true, "-": true, "*": true, "//": true, "%": true, "==": true, "!=": true,
    "<=": true, ">=": true, "<": true, ">": true, "is": true };
function isOp(maybeOp) {
    return maybeOp in ops;
}
exports.isOp = isOp;
var uops = { "not": true, "-": true };
function isUop(maybeUop) {
    return maybeUop in uops;
}
exports.isUop = isUop;
