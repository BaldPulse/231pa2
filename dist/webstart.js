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
var compiler_1 = require("./compiler");
document.addEventListener("DOMContentLoaded", function () { return __awaiter(void 0, void 0, void 0, function () {
    function display(arg) {
        var elt = document.createElement("pre");
        document.getElementById("output").appendChild(elt);
        elt.innerText = arg;
    }
    var importObject, runButton, userCode;
    return __generator(this, function (_a) {
        importObject = {
            imports: {
                print_num: function (arg) {
                    console.log("Logging from WASM: ", arg);
                    display(String(arg));
                    return arg;
                },
                print_bool: function (arg) {
                    if (arg === 0) {
                        display("False");
                    }
                    else {
                        display("True");
                    }
                    return arg;
                },
                print_none: function (arg) {
                    display("None");
                    return arg;
                }
            },
        };
        runButton = document.getElementById("run");
        userCode = document.getElementById("user-code");
        runButton.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
            var program, output, wat, code, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        program = userCode.value;
                        output = document.getElementById("output");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        wat = compiler_1.compile(program);
                        code = document.getElementById("generated-code");
                        code.textContent = wat;
                        return [4 /*yield*/, compiler_1.run(wat, importObject)];
                    case 2:
                        result = _a.sent();
                        output.textContent += String(result);
                        output.setAttribute("style", "color: black");
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        output.textContent = String(e_1);
                        output.setAttribute("style", "color: red");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        userCode.value = localStorage.getItem("program");
        userCode.addEventListener("keypress", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                localStorage.setItem("program", userCode.value);
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
