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
      const val = this.evaluate(node.value);

      // Pengecekan kesesuaian tipe data (Type Safety)
      if (node.dataType === "angka" && typeof val !== "number") {
        throw new Error(`Error Runtime [Baris ${node.line}]: Tipe data tidak cocok. Variabel "${node.name}" dideklarasikan sebagai "angka", tetapi Anda mengisinya dengan tipe "${typeof val}" (${JSON.stringify(val)}).`);
      }
      if (node.dataType === "teks" && typeof val !== "string") {
        throw new Error(`Error Runtime [Baris ${node.line}]: Tipe data tidak cocok. Variabel "${node.name}" dideklarasikan sebagai "teks", tetapi Anda mengisinya dengan tipe "${typeof val}" (${JSON.stringify(val)}).`);
      }
      if (node.dataType === "boolean" && typeof val !== "boolean") {
        throw new Error(`Error Runtime [Baris ${node.line}]: Tipe data tidak cocok. Variabel "${node.name}" dideklarasikan sebagai "boolean", tetapi Anda mengisinya dengan tipe "${typeof val}" (${JSON.stringify(val)}).`);
      }

      this.variables[node.name] = val;
      return;
    }

    if (node.type === "PrintStatement") {
      // Print either a literal string or the value of an identifier.
      if (node.valueType === "identifier") {
        if (!(node.value in this.variables)) {
          throw new Error(`Error Runtime [Baris ${node.line}]: Variabel "${node.value}" belum dibuat. Silakan deklarasikan variabel ini terlebih dahulu menggunakan perintah: buat <tipe> ${node.value} = <nilai>`);
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

    throw new Error(`Error Runtime [Baris ${node.line}]: Node pernyataan tipe "${node.type}" tidak dikenal.`);
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
        throw new Error(`Error Runtime [Baris ${node.line}]: Variabel "${node.value}" belum dibuat. Silakan deklarasikan variabel ini terlebih dahulu menggunakan perintah: buat <tipe> ${node.value} = <nilai>`);
      }
      return this.variables[node.value];
    }

    if (node.type === "UnaryExpression") {
      const right = this.evaluate(node.right);
      if (node.operator === "-") {
        if (typeof right !== "number") {
          throw new Error(`Error Runtime [Baris ${node.line}]: Operator "-" hanya dapat digunakan pada nilai angka.`);
        }
        return -right;
      }
    }

    if (node.type === "BinaryExpression") {
      const left = this.evaluate(node.left);
      const right = this.evaluate(node.right);

      switch (node.operator) {
        case "+":
          if (typeof left !== typeof right) {
            throw new Error(`Error Runtime [Baris ${node.line}]: Operasi "+" tidak kompatibel antara tipe data "${typeof left}" dan "${typeof right}".`);
          }
          return left + right;
        case "-":
          if (typeof left !== "number" || typeof right !== "number") {
            throw new Error(`Error Runtime [Baris ${node.line}]: Operasi "-" hanya dapat dilakukan antar tipe data angka.`);
          }
          return left - right;
        case "*":
          if (typeof left !== "number" || typeof right !== "number") {
            throw new Error(`Error Runtime [Baris ${node.line}]: Operasi "*" hanya dapat dilakukan antar tipe data angka.`);
          }
          return left * right;
        case "/":
          if (typeof left !== "number" || typeof right !== "number") {
            throw new Error(`Error Runtime [Baris ${node.line}]: Operasi "/" hanya dapat dilakukan antar tipe data angka.`);
          }
          if (right === 0) {
            throw new Error(`Error Runtime [Baris ${node.line}]: Kesalahan matematika! Anda mencoba melakukan pembagian dengan angka nol.`);
          }
          return left / right;
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
          throw new Error(`Error Runtime [Baris ${node.line}]: Operator matematika/perbandingan "${node.operator}" tidak dikenal.`);
      }
    }

    throw new Error(`Error Runtime [Baris ${node.line}]: Ekspresi tipe "${node.type}" tidak dikenal.`);
  }
}

module.exports = Interpreter;