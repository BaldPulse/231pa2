"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOp = void 0;
var ops = { "+": true, "-": true, "*": true, "//": true, "%": true, "==": true, "!=": true,
    "<=": true, ">=": true, "<": true, ">": true, "is": true };
function isOp(maybeOp) {
    return maybeOp in ops;
}
exports.isOp = isOp;
