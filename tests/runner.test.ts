import { compile, run } from '../compiler';
import { assert,expect } from 'chai';
import 'mocha';
import { stringify } from 'querystring';

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

  it('prints a boolean', async() => {
    await runTest("print(True)");
    expect(importObject.output).to.equal("True\n");
  });

  it('prints a int', async() => {
    await runTest("print(1)");
    expect(importObject.output).to.equal("1\n");
  });

  it('prints None', async() => {
    await runTest("print(None)");
    expect(importObject.output).to.equal("None\n");
  });

  it('vardef int', async() => {
    await runTest("x:int = 0\nprint(x)");
    expect(importObject.output).to.equal("0\n");
  });

  it('vardef bool', async() => {
    await runTest("x:bool = False\nprint(x)");
    expect(importObject.output).to.equal("False\n");
  });

  it('vardef wrong1', async() => {
    try {
      await runTest("x:bool = 1");
    } catch (err:any) {
      expect(err.message).to.contain("Cannot assign")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('vardef wrong2', async() => {
    try {
      await runTest("x:int = None");
    } catch (err:any) {
      expect(err.message).to.contain("Cannot assign")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('vardef wrong3', async() => {
    try {
      await runTest("x:int = 1+2");
    } catch (err:any) {
      expect(err.message).to.contain("Cannot assign non literal")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  // Note: it is often helpful to write tests for a functionality before you
  // implement it. You will make this test pass!
  it('adds two numbers', async() => {
    const result = await runTest("2 + 3");
    expect(result).to.equal(5);
  });

  it('adds two booleans', async() => {
    try {
      await runTest("True + False");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('subtracts two numbers', async() => {
    const result = await runTest("2 - 3");
    expect(result).to.equal(-1);
  });

  it('subtracts two booleans', async() => {
    try {
      await runTest("True - 1");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('multiplies two numbers', async() => {
    const result = await runTest("2 * 3");
    expect(result).to.equal(6);
  });

  it('multiplies two booleans', async() => {
    try {
      await runTest("True * False");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });


  it('divides two numbers', async() => {
    const result = await runTest("4 // 2");
    expect(result).to.equal(2);
  });
  
  it('divides two booleans', async() => {
    try {
      await runTest("True // False");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('remainder of division of two numbers', async() => {
    const result = await runTest("2 % 3");
    expect(result).to.equal(2);
  });

  it('remainder of division of boolean and num', async() => {
    try {
      await runTest("2 % False");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('equality of two numbers', async() => {
    const result = await runTest("print(2 == 3)");
    expect(importObject.output).to.equal("False\n");
  });

  it('equality of two booleans', async() => {
    const result = await runTest("print(False == False)");
    expect(importObject.output).to.equal("True\n");
  });

  it('equality of num and bool', async() => {
    try {
      await runTest("1 == True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('inequality of two numbers', async() => {
    const result = await runTest("print(2 != 3)");
    expect(importObject.output).to.equal("True\n");
  });

  it('inequality of two booleans', async() => {
    const result = await runTest("print(False != False)");
    expect(importObject.output).to.equal("False\n");
  });

  it('inequality of num and bool', async() => {
    try {
      await runTest("1 != True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('leq of two numbers', async() => {
    const result = await runTest("print(2 <= 3)");
    expect(importObject.output).to.equal("True\n");
  });

  it('leq of two numbers2', async() => {
    const result = await runTest("print(2 <= 2)");
    expect(importObject.output).to.equal("True\n");
  });

  it('leq of two booleans', async() => {
    try {
      await runTest("True <= True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('leq of num and bool', async() => {
    try {
      await runTest("1 <= True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('geq of two numbers', async() => {
    const result = await runTest("print(2 >= 3)");
    expect(importObject.output).to.equal("False\n");
  });

  it('geq of two numbers2', async() => {
    const result = await runTest("print(2 >= 2)");
    expect(importObject.output).to.equal("True\n");
  });

  it('geq of two booleans', async() => {
    try {
      await runTest("True >= True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('geq of num and bool', async() => {
    try {
      await runTest("1 >= True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('lesser of two numbers', async() => {
    const result = await runTest("print(2 < 3)");
    expect(importObject.output).to.equal("True\n");
  });

  it('lesser of two numbers2', async() => {
    const result = await runTest("print(2 < 2)");
    expect(importObject.output).to.equal("False\n");
  });

  it('lesser of two booleans', async() => {
    try {
      await runTest("True < True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('lesser of num and bool', async() => {
    try {
      await runTest("1 < True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('greater of two numbers', async() => {
    const result = await runTest("print(2 > 3)");
    expect(importObject.output).to.equal("False\n");
  });

  it('greater of two numbers2', async() => {
    const result = await runTest("print(2 > 2)");
    expect(importObject.output).to.equal("False\n");
  });

  it('greater of two booleans', async() => {
    try {
      await runTest("True > True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('greater of num and bool', async() => {
    try {
      await runTest("1 > True");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('not bool', async() => {
    const result = await runTest("print(not True)");
    expect(importObject.output).to.equal("False\n");
  });

  it('not int', async() => {
    try {
      await runTest("print(not 1)");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('negative int', async() => {
    const result = await runTest("print(-1)");
    expect(importObject.output).to.equal("-1\n");
  });

  it('negative bool', async() => {
    try {
      await runTest("print(- True)");
    } catch (err:any) {
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('fun with parens1', async() => {
    const result = await runTest("2*(2+2)");
    expect(result).to.equal(8);
  });

  it('fun with parens2', async() => {
    const result = await runTest("2*(-2)");
    expect(result).to.equal(-4);
  });

  it('fun with parens3', async() => {
    const result = await runTest("(2+1)*(-2+3)");
    expect(result).to.equal(3);
  });

  it('fun with parens4', async() => {
    try {
      await runTest("1*(-(False))");
    } catch (err:any) {
      expect(err.message).to.contain("Invalid Operand")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('assign before define', async() => {
    try {
      await runTest("x = 1");
    } catch (err:any) {
      expect(err.message).to.contain("Assignment before definition")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('duplicate definition', async() => {
    try {
      await runTest("x:int = 1\n x:bool = True");
    } catch (err:any) {
      expect(err.message).to.contain("Duplicate definition")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  // it('fun with parens5', async() => {
  //   try {
  //     await runTest("1*(-(False))");
  //   } catch (err:any) {
  //     return; // end the test
  //   }
  //   assert.fail("didn't throw");
  // });

  it('if', async() => {
    const result = await runTest("if 1==1 :\n\tprint(True)");
    expect(importObject.output).to.equal("True\n");
  });

  it('if else', async() => {
    const result = await runTest("if 1!=1 :\n\tprint(True)\nelse:\n\tprint(False)");
    expect(importObject.output).to.equal("False\n");
  });

  it('if elif else', async() => {
    const result = await runTest("if 1!=1 :\n\tprint(True)\nelif 1==1 :\n\tprint(-10)\nelse:\n\tprint(False)");
    expect(importObject.output).to.equal("-10\n");
  });

  it('nested if1', async() => {
    const result = await runTest(`
    if 1==1 :
      if 1==1 :
        print(-10)
    else:
      print(False) 
  `);
    expect(importObject.output).to.equal("-10\n");
  });

  it('nested if2', async() => {
    const result = await runTest(`
    if 1!=1 :
      if 1==1 :
        print(-10)
    else:
      print(False)
      if 1==1 :
        print(True)
    `);
    expect(importObject.output).to.equal("False\nTrue\n");
  });

  it('vardef in if', async() => {
    try {
      await runTest(`
      if 1!=1 :
        x:int = 1
        if 1==1 :
          print(x)
      else:
        print(False)
        if 1==1 :
          print(True)
      `);
    } catch (err:any) {
      expect(err.message).to.contain("Variable definition")
      return; // end the test
    }
    assert.fail("didn't throw");
  });

  it('while loop', async() => {
    const result = await runTest(`
    x:int = 0
    while(x<10):
      x=x+1
      print(x)
    `);
    expect(importObject.output).to.equal("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
  });

  it('nested while loop', async() => {
    const result = await runTest(`
    x:int = 0
    y:int = 0
    while(x<2):
      x=x+1
      y = 0
      while(y<2):
        print(y)
        y=y+1
      print(x)
    `);
    expect(importObject.output).to.equal("0\n1\n1\n0\n1\n2\n");
  });

  it('if in while loop', async() => {
    const result = await runTest(`
    x:int = 0
    while(x<10):
      x=x+1
      if(x<5):
        print(x)
    print(x)
    `);
    expect(importObject.output).to.equal("1\n2\n3\n4\n10\n");
  });
  
  it('simple function1', async() => {
    const result = await runTest(`
    def fun()->int:
      a:int = 0
      print(a)
      return a
    fun()
    `);
    expect(importObject.output).to.equal("0\n");
    expect(result).to.equal(0);
  });

  it('simple function2', async() => {
    const result = await runTest(`
    def fun(a:int)->int:
      print(a)
      return a
    fun(0)
    `);
    expect(importObject.output).to.equal("0\n");
    expect(result).to.equal(0);
  });

  it('simple function3', async() => {
    const result = await runTest(`
    def fun(a:int, b:int):
      print(a)
      print(b)
    fun(0,1)
    `);
    expect(importObject.output).to.equal("0\n1\n");
  });

  it('nested function1', async() => {
    const result = await runTest(`
    def fun(a:int):
      print(a)
    def fun2(a:int, b:int):
      print(b) 
      fun(a)
    fun2(0,1)
    `);
    expect(importObject.output).to.equal("1\n0\n");
  });

  it('nested function2', async() => {
    const result = await runTest(`
    def fun2(a:int, b:int)->int:
      return a+b
    def fun(a:int):
      print(a)
    fun(fun2(1,1))
    `);
    expect(importObject.output).to.equal("2\n");
  });

  it('recursion 1', async() => {
    const result = await runTest(`
    def fun(a:int)->int:
      if(a<1):
        return 0
      else:
        print(a)
        return fun(a-1)
    fun(3)
    `);
    expect(importObject.output).to.equal("3\n2\n1\n");
  });

  it('recursion 2', async() => {
    const result = await runTest(`
    def fun1(a:int)->int:
      if a==0:
        return 0
      else:
        print(1)
        return fun2(a)
    def fun2(a:int)->int
      if a==0:
        return 0
      else:
        print(2)
        return fun2(a)
    fun1(4)
    `);
    expect(importObject.output).to.equal("1\n2\n1\n2\n");
  });

});