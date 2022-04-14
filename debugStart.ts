import { stringifyTree } from "./treeprint";
import { parseProgram } from "./parser";
import { compile, run  } from "./compiler";
import {parser} from "lezer-python";
import { tcProgram } from './tc';

const importObject = {
    imports: {
      // we typically define print to mean logging to the console. To make testing
      // the compiler easier, we define print so it logs to a string object.
      //  We can then examine output to see what would have been printed in the
      //  console.
      print_num: (arg : any) => {
        importObject.output += arg;
        importObject.output += "\n";
        return arg;
      },
      print_bool: (arg : any) => {
        if(arg !== 0) { importObject.output += "True"; }
        else { importObject.output += "False"; }
        importObject.output += "\n";
      },
      print_none: (arg : any) => {
        importObject.output += "None";
        importObject.output += "\n";
      }
    },
  
    output: ""
  };

const source = `
def f(a:int):
  while(a>0):
    a = a-1
    print(a)
    if(a<3):
      return

f(5)
`;
// console.log(source);//\nelif 2==3:\n\tprint(False)\nelse:\n\tprint(0)" ;
const t = parser.parse(source);
console.log(stringifyTree(t.cursor(),source,0));
const ast = parseProgram(source);
console.log(JSON.stringify((ast), null,2));
console.log(compile(source));