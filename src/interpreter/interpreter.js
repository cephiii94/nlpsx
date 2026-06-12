// src/interpreter/interpreter.js

class Interpreter {
  constructor(ast) {
    this.ast = ast;
  }

  run() {
    for (const node of this.ast.body) {
      this.execute(node);
    }
  }

  execute(node) {
    if (node.type === "PrintStatement") {
      console.log(node.value);
      return;
    }

    throw new Error(`Node tidak dikenal: ${node.type}`);
  }
}

module.exports = Interpreter;