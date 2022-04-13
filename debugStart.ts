import { stringifyTree } from "./treeprint";
import { parseProgram } from "./parser";
import { compile } from "./compiler";
import {parser} from "lezer-python";

const source = "x:int = 0\nprint(x)" ;
// const t = parser.parse(source);
// console.log(stringifyTree(t.cursor(),source,0));
// const ast = parseProgram(source);
// console.log(JSON.stringify(ast, null,2));
console.log(compile(source))