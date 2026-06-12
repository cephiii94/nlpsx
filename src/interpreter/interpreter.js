class Interpreter {
  constructor(ast) {
    this.ast = ast;
    this.variables = {};
  }

  run() {
    for (const node of this.ast.body) {
      this.execute(node);
    }
  }

  execute(node) {
    if (node.type === "VariableDeclaration") {
      this.variables[node.name] = node.value;
      return;
    }

    if (node.type === "PrintStatement") {
      if (node.valueType === "identifier") {
        console.log(this.variables[node.value]);
        return;
      }

      console.log(node.value);
      return;
    }

    throw new Error(`Node tidak dikenal: ${node.type}`);
  }
}

module.exports = Interpreter;