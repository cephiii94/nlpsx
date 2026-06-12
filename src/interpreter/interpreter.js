// src/interpreter/interpreter.js
// Very small interpreter for the NLPSX AST. Executes variable declarations,
// print statements and evaluates simple expressions (currently only +).

class Interpreter {
  constructor(ast, outputFn = console.log) {
    this.ast = ast;
    // runtime variable storage: name -> value
    this.variables = {};
    this.output = outputFn;
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
        if (!(node.value in this.variables)) {
          throw new Error(`Error Runtime: Variabel "${node.value}" belum dideklarasikan di Baris ${node.line}, Kolom ${node.column}`);
        }
        this.output(this.variables[node.value]);
        return;
      }

      this.output(node.value);
      return;
    }

    if (node.type === "IfStatement") {
      const conditionValue = this.evaluate(node.condition);
      if (conditionValue) {
        this.execute(node.consequent);
      } else if (node.alternate) {
        this.execute(node.alternate);
      }
      return;
    }

    throw new Error(`Error Runtime: Node tidak dikenal "${node.type}" di Baris ${node.line}, Kolom ${node.column}`);
  }

  // Evaluate an expression node and return its runtime value.
  evaluate(node) {
    if (node.type === "STRING" || node.type === "NUMBER") {
      return node.value;
    }

    if (node.type === "TRUE" || node.type === "FALSE") {
      return node.value;
    }

    if (node.type === "IDENTIFIER") {
      if (!(node.value in this.variables)) {
        throw new Error(`Error Runtime: Variabel "${node.value}" belum dideklarasikan di Baris ${node.line}, Kolom ${node.column}`);
      }
      return this.variables[node.value];
    }

    if (node.type === "BinaryExpression") {
      const left = this.evaluate(node.left);
      const right = this.evaluate(node.right);

      switch (node.operator) {
        case "+":
          if (typeof left !== typeof right) {
            throw new Error(`Error Runtime: Operasi "+" tidak kompatibel antara tipe ${typeof left} dan ${typeof right} di Baris ${node.line}, Kolom ${node.column}`);
          }
          return left + right;
        case ">":
          return left > right;
        case "<":
          return left < right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        case "==":
          return left == right;
        case "!=":
          return left != right;
        default:
          throw new Error(`Error Runtime: Operator tidak dikenal "${node.operator}" di Baris ${node.line}, Kolom ${node.column}`);
      }
    }

    throw new Error(`Error Runtime: Ekspresi tidak dikenal "${node.type}" di Baris ${node.line}, Kolom ${node.column}`);
  }
}

module.exports = Interpreter;