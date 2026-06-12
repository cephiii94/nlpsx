// src/interpreter/interpreter.js
// Very small interpreter for the NLPSX AST. Executes variable declarations,
// print statements and evaluates simple expressions (currently only +).

class Interpreter {
  constructor(ast) {
    this.ast = ast;
    // runtime variable storage: name -> value
    this.variables = {};
  }

  // Execute every top-level statement in the program AST.
  run() {
    for (const node of this.ast.body) {
      this.execute(node);
    }
  }

  // Execute a single AST node.
  execute(node) {
    if (node.type === "VariableDeclaration") {
      // Evaluate the initializer and store it under the variable name.
      this.variables[node.name] = this.evaluate(node.value);
      return;
    }

    if (node.type === "PrintStatement") {
      // Print either a literal string or the value of an identifier.
      if (node.valueType === "identifier") {
        console.log(this.variables[node.value]);
        return;
      }

      console.log(node.value);
      return;
    }

    throw new Error(`Node tidak dikenal: ${node.type}`);
  }

  // Evaluate an expression node and return its runtime value.
  evaluate(node) {
    if (node.type === "STRING" || node.type === "NUMBER") {
      return node.value;
    }

    if (node.type === "IDENTIFIER") {
      return this.variables[node.value];
    }

    if (node.type === "BinaryExpression") {
      const left = this.evaluate(node.left);
      const right = this.evaluate(node.right);

      // Only addition supported for now.
      if (node.operator === "+") {
        return left + right;
      }
    }

    throw new Error(`Expression tidak dikenal: ${node.type}`);
  }
}

module.exports = Interpreter;