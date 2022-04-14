"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("../compiler");
var chai_1 = require("chai");
require("mocha");
function runTest(source) {
    return compiler_1.run(compiler_1.compile(source), importObject);
}
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
// Clear the output before every test
beforeEach(function () {
    importObject.output = "";
});
// We write end-to-end tests here to make sure the compiler works as expected.
// You should write enough end-to-end tests until you are confident the compiler
// runs as expected. 
describe('run(source, config) function', function () {
    var config = { importObject: importObject };
    // We can test the behavior of the compiler in several ways:
    // 1- we can test the return value of a program
    // Note: since run is an async function, we use await to retrieve the 
    // asynchronous return value. 
    it('returns the right number', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("987")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(987);
                    return [2 /*return*/];
            }
        });
    }); });
    it('prints a boolean', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(True)")];
                case 1:
                    _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('prints a int', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(1)")];
                case 1:
                    _a.sent();
                    chai_1.expect(importObject.output).to.equal("1\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('prints None', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(None)")];
                case 1:
                    _a.sent();
                    chai_1.expect(importObject.output).to.equal("None\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('vardef int', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("x:int = 0\nprint(x)")];
                case 1:
                    _a.sent();
                    chai_1.expect(importObject.output).to.equal("0\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('vardef bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("x:bool = False\nprint(x)")];
                case 1:
                    _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('vardef wrong1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("x:bool = 1")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    chai_1.expect(err_1.message).to.contain("Cannot assign");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('vardef wrong2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("x:int = None")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    chai_1.expect(err_2.message).to.contain("Cannot assign");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('vardef wrong3', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("x:int = 1+2")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    chai_1.expect(err_3.message).to.contain("Cannot assign non literal");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    // Note: it is often helpful to write tests for a functionality before you
    // implement it. You will make this test pass!
    it('adds two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("2 + 3")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(5);
                    return [2 /*return*/];
            }
        });
    }); });
    it('adds two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True + False")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    chai_1.expect(err_4.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('subtracts two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("2 - 3")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(-1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('subtracts two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True - 1")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _a.sent();
                    chai_1.expect(err_5.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('multiplies two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("2 * 3")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(6);
                    return [2 /*return*/];
            }
        });
    }); });
    it('multiplies two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True * False")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _a.sent();
                    chai_1.expect(err_6.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('divides two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("4 // 2")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('divides two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True // False")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_7 = _a.sent();
                    chai_1.expect(err_7.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('remainder of division of two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("2 % 3")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('remainder of division of boolean and num', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("2 % False")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_8 = _a.sent();
                    chai_1.expect(err_8.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('equality of two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 == 3)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('equality of two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(False == False)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('equality of num and bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("1 == True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_9 = _a.sent();
                    chai_1.expect(err_9.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('inequality of two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 != 3)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('inequality of two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(False != False)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('inequality of num and bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("1 != True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_10 = _a.sent();
                    chai_1.expect(err_10.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('leq of two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 <= 3)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('leq of two numbers2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 <= 2)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('leq of two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True <= True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_11 = _a.sent();
                    chai_1.expect(err_11.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('leq of num and bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("1 <= True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_12 = _a.sent();
                    chai_1.expect(err_12.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('geq of two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 >= 3)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('geq of two numbers2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 >= 2)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('geq of two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True >= True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_13 = _a.sent();
                    chai_1.expect(err_13.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('geq of num and bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("1 >= True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_14 = _a.sent();
                    chai_1.expect(err_14.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('lesser of two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 < 3)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('lesser of two numbers2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 < 2)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('lesser of two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True < True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_15 = _a.sent();
                    chai_1.expect(err_15.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('lesser of num and bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("1 < True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_16 = _a.sent();
                    chai_1.expect(err_16.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('greater of two numbers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 > 3)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('greater of two numbers2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(2 > 2)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('greater of two booleans', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("True > True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_17 = _a.sent();
                    chai_1.expect(err_17.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('greater of num and bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("1 > True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_18 = _a.sent();
                    chai_1.expect(err_18.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('not bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(not True)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('not int', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("print(not 1)")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_19 = _a.sent();
                    chai_1.expect(err_19.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('negative int', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("print(-1)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("-1\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('negative bool', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("print(- True)")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_20 = _a.sent();
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('fun with parens1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("2*(2+2)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(8);
                    return [2 /*return*/];
            }
        });
    }); });
    it('fun with parens2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("2*(-2)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(-4);
                    return [2 /*return*/];
            }
        });
    }); });
    it('fun with parens3', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("(2+1)*(-2+3)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.equal(3);
                    return [2 /*return*/];
            }
        });
    }); });
    it('fun with parens4', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("1*(-(False))")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_21 = _a.sent();
                    chai_1.expect(err_21.message).to.contain("Invalid Operand");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('assign before define', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("x = 1")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_22 = _a.sent();
                    chai_1.expect(err_22.message).to.contain("Assignment before definition");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('duplicate definition', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("x:int = 1\n x:bool = True")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_23 = _a.sent();
                    chai_1.expect(err_23.message).to.contain("Duplicate definition");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    // it('fun with parens5', async() => {
    //   try {
    //     await runTest("1*(-(False))");
    //   } catch (err:any) {
    //     return; // end the test
    //   }
    //   assert.fail("didn't throw");
    // });
    it('if', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("if 1==1 :\n\tprint(True)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("True\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('if else', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("if 1!=1 :\n\tprint(True)\nelse:\n\tprint(False)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('if elif else', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("if 1!=1 :\n\tprint(True)\nelif 1==1 :\n\tprint(-10)\nelse:\n\tprint(False)")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("-10\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('nested if1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    if 1==1 :\n      if 1==1 :\n        print(-10)\n    else:\n      print(False) \n  ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("-10\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('nested if2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    if 1!=1 :\n      if 1==1 :\n        print(-10)\n    else:\n      print(False)\n      if 1==1 :\n        print(True)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("False\nTrue\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('vardef in if', function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_24;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, runTest("\n      if 1!=1 :\n        x:int = 1\n        if 1==1 :\n          print(x)\n      else:\n        print(False)\n        if 1==1 :\n          print(True)\n      ")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_24 = _a.sent();
                    chai_1.expect(err_24.message).to.contain("Variable definition");
                    return [2 /*return*/]; // end the test
                case 3:
                    chai_1.assert.fail("didn't throw");
                    return [2 /*return*/];
            }
        });
    }); });
    it('while loop', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    x:int = 0\n    while(x<10):\n      x=x+1\n      print(x)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('nested while loop', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    x:int = 0\n    y:int = 0\n    while(x<2):\n      x=x+1\n      y = 0\n      while(y<2):\n        print(y)\n        y=y+1\n      print(x)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("0\n1\n1\n0\n1\n2\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('if in while loop', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    x:int = 0\n    while(x<10):\n      x=x+1\n      if(x<5):\n        print(x)\n    print(x)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("1\n2\n3\n4\n10\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('simple function1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    def fun()->int:\n      a:int = 0\n      print(a)\n      return a\n    fun()\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("0\n");
                    chai_1.expect(result).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('simple function2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    def fun(a:int)->int:\n      print(a)\n      return a\n    fun(0)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("0\n");
                    chai_1.expect(result).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('simple function3', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    def fun(a:int, b:int):\n      print(a)\n      print(b)\n    fun(0,1)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("0\n1\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('nested function1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    def fun(a:int):\n      print(a)\n    def fun2(a:int, b:int):\n      print(b) \n      fun(a)\n    fun2(0,1)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("1\n0\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('nested function2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    def fun2(a:int, b:int)->int:\n      return a+b\n    def fun(a:int):\n      print(a)\n    fun(fun2(1,1))\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("2\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('recursion 1', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    def fun(a:int)->int:\n      if(a<1):\n        return 0\n      else:\n        print(a)\n        return fun(a-1)\n    fun(3)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("3\n2\n1\n");
                    return [2 /*return*/];
            }
        });
    }); });
    it('recursion 2', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runTest("\n    def fun1(a:int)->int:\n      if a==0:\n        return 0\n      else:\n        print(1)\n        return fun2(a)\n    def fun2(a:int)->int\n      if a==0:\n        return 0\n      else:\n        print(2)\n        return fun2(a)\n    fun1(4)\n    ")];
                case 1:
                    result = _a.sent();
                    chai_1.expect(importObject.output).to.equal("1\n2\n1\n2\n");
                    return [2 /*return*/];
            }
        });
    }); });
});
