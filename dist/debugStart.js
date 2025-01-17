"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var treeprint_1 = require("./treeprint");
var parser_1 = require("./parser");
var lezer_python_1 = require("lezer-python");
var source = "x:int = 0\nprint(x)";
var t = lezer_python_1.parser.parse(source);
console.log(treeprint_1.stringifyTree(t.cursor(), source, 0));
var ast = parser_1.parseProgram(source);
console.log(JSON.stringify(ast, null, 2));
