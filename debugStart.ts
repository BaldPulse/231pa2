import { stringifyTree } from "./treeprint";
import { parseProgram } from "./parser";
import {parser} from "lezer-python";

const source = "a int = 1" ;
const t = parser.parse(source);
console.log(stringifyTree(t.cursor(),source,0));
const ast = parseProgram(source);
console.log(JSON.stringify(ast, null,2));