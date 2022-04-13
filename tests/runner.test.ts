import { compile, run } from '../compiler';
import { expect } from 'chai';
import 'mocha';

function runTest(source : string) {
  return run(compile(source), importObject);
}

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

// Clear the output before every test
beforeEach(function () {
  importObject.output = "";
});
  
// We write end-to-end tests here to make sure the compiler works as expected.
// You should write enough end-to-end tests until you are confident the compiler
// runs as expected. 
describe('run(source, config) function', () => {
  const config = { importObject };
  
  // We can test the behavior of the compiler in several ways:
  // 1- we can test the return value of a program
  // Note: since run is an async function, we use await to retrieve the 
  // asynchronous return value. 
  it('returns the right number', async () => {
    const result = await runTest("987");
    expect(result).to.equal(987);
  });

  // Note: it is often helpful to write tests for a functionality before you
  // implement it. You will make this test pass!
  it('adds two numbers', async() => {
    const result = await runTest("2 + 3");
    expect(result).to.equal(5);
  });

  it('subtracts two numbers', async() => {
    const result = await runTest("2 - 3");
    expect(result).to.equal(-1);
  });
  //+ | - | * | // | % | == | != | <= | >= | < | > | is  
  it('multiplies two numbers', async() => {
    const result = await runTest("2 * 3");
    expect(result).to.equal(6);
  });

  it('divides two numbers', async() => {
    const result = await runTest("4 // 2");
    expect(result).to.equal(2);
  });
  //TODO: figure out how to test error throws
  // it('divides two booleans', async() => {
  //   const result = await runTest("True // False");
  //   expect(result).to.equal(2);
  // });

  it('remainder of division of two numbers', async() => {
    const result = await runTest("2 % 3");
    expect(result).to.equal(2);
  });

  it('equality of two numbers', async() => {
    const result = await runTest("2 == 3");
    expect(result).to.equal(false);
  });

  it('prints a boolean', async() => {
    await runTest("print(True)");
    expect(importObject.output).to.equal("True\n");
  });

  it('typedef int', async() => {
    await runTest("x:int = 0\nprint(x)");
    expect(importObject.output).to.equal("0\n");
  });

  it('typedef bool', async() => {
    await runTest("x:int = False\nprint(x)");
    expect(importObject.output).to.equal("False\n");
  });

});