"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("./compiler");
// command to run:
// node node-main.js 987
var input = process.argv[2];
var result = compiler_1.compile(input);
console.log(result);
compiler_1.run(result, {}).then(function (value) {
    console.log(value);
});
