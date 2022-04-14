"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var treeprint_1 = require("./treeprint");
var parser_1 = require("./parser");
var compiler_1 = require("./compiler");
var lezer_python_1 = require("lezer-python");
var importObject = {
    imports: {
        // we typically define print to mean logging to the console. To make testing
        // the compiler easier, we define print so it logs to a string object.
        //  We can then examine output to see what would have been printed in the
        //  console.
        print_num: function (arg) {
            importObject.output += arg;
            importObject.output += "\n";
            return arg;
        },
        print_bool: function (arg) {
            if (arg !== 0) {
                importObject.output += "True";
            }
            else {
                importObject.output += "False";
            }
            importObject.output += "\n";
        },
        print_none: function (arg) {
            importObject.output += "None";
            importObject.output += "\n";
        }
    },
    output: ""
};
var source = "\ndef fun1(a:int)->int:\n  if a==0:\n    return 0\n  else:\n    print(1)\n    return fun2(a)\ndef fun2(a:int)->int\n  if a==0:\n    return 0\n  else:\n    print(2)\n    return fun2(a)\nfun1(4)\n";
// console.log(source);//\nelif 2==3:\n\tprint(False)\nelse:\n\tprint(0)" ;
var t = lezer_python_1.parser.parse(source);
console.log(treeprint_1.stringifyTree(t.cursor(), source, 0));
var ast = parser_1.parseProgram(source);
console.log(JSON.stringify((ast), null, 2));
console.log(compiler_1.compile(source));
