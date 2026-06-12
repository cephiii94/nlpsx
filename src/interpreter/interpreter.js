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
      this.variables[node.name] = this.evaluate(node.value);
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

      if (node.operator === "+") {
        return left + right;
      }
    }

    throw new Error(`Expression tidak dikenal: ${node.type}`);
  }
}

module.exports = Interpreter;