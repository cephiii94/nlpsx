// src/interpreter/interpreter.js
// Very small interpreter for the NLPSX AST. Executes variable declarations,
// print statements and evaluates simple expressions (currently only +).

class ReturnSignal extends Error {
  constructor(value, line) {
    super();
    this.value = value;
    this.line = line;
  }
}

class Interpreter {
  constructor(ast, outputFn = console.log) {
    this.ast = ast;
    // runtime scope stack: array of scope objects (from global to local)
    this.scopes = [{}];
    this.functions = {};
    this.output = outputFn;
  }

  // Getter for variables pointing to global scope for backwards compatibility
  get variables() {
    return this.scopes[0];
  }

  declareVariable(name, value) {
    const currentScope = this.scopes[this.scopes.length - 1];
    currentScope[name] = value;
  }

  assignVariable(name, value, line) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name in this.scopes[i]) {
        this.scopes[i][name] = value;
        return;
      }
    }
    throw new Error(`Error Runtime [Baris ${line}]: Variabel "${name}" belum dideklarasikan. Silakan deklarasikan terlebih dahulu menggunakan kata kunci "adalah".`);
  }

  getVariable(name, line) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name in this.scopes[i]) {
        return this.scopes[i][name];
      }
    }
    throw new Error(`Error Runtime [Baris ${line}]: Variabel "${name}" belum dideklarasikan. Silakan deklarasikan terlebih dahulu menggunakan kata kunci "adalah".`);
  }

  // Execute every top-level statement in the program AST.
  run() {
    try {
      for (const node of this.ast.body) {
        this.execute(node);
      }
    } catch (err) {
      if (err instanceof ReturnSignal) {
        throw new Error(`Error Runtime [Baris ${err.line}]: Perintah "kembalikan" hanya dapat ditulis di dalam fungsi.`);
      }
      throw err;
    }
  }

  executeFunctionCall(node) {
    const func = this.functions[node.name];
    if (!func) {
      throw new Error(`Error Runtime [Baris ${node.line}]: Fungsi "${node.name}" belum dibuat. Silakan buat fungsi ini terlebih dahulu menggunakan perintah: fungsi ${node.name}(...)`);
    }

    if (node.args.length !== func.params.length) {
      throw new Error(`Error Runtime [Baris ${node.line}]: Fungsi "${node.name}" mengharapkan ${func.params.length} argumen, tetapi mendapatkan ${node.args.length}.`);
    }

    // Evaluate arguments in the current scope BEFORE pushing the new function scope
    const evaluatedArgs = [];
    for (let i = 0; i < node.args.length; i++) {
      const argValue = this.evaluate(node.args[i]);
      const param = func.params[i];

      // Parameter type safety check
      if (param.type === "angka" && typeof argValue !== "number") {
        throw new Error(`Error Runtime [Baris ${node.line}]: Argumen ke-${i + 1} tidak cocok. Fungsi "${node.name}" mengharapkan parameter "${param.name}" bernilai tipe "angka", tetapi Anda memberikan tipe "${typeof argValue}" (${JSON.stringify(argValue)}).`);
      }
      if (param.type === "teks" && typeof argValue !== "string") {
        throw new Error(`Error Runtime [Baris ${node.line}]: Argumen ke-${i + 1} tidak cocok. Fungsi "${node.name}" mengharapkan parameter "${param.name}" bernilai tipe "teks", tetapi Anda memberikan tipe "${typeof argValue}" (${JSON.stringify(argValue)}).`);
      }
      if (param.type === "boolean" && typeof argValue !== "boolean") {
        throw new Error(`Error Runtime [Baris ${node.line}]: Argumen ke-${i + 1} tidak cocok. Fungsi "${node.name}" mengharapkan parameter "${param.name}" bernilai tipe "boolean", tetapi Anda memberikan tipe "${typeof argValue}" (${JSON.stringify(argValue)}).`);
      }

      evaluatedArgs.push({ name: param.name, value: argValue });
    }

    // Push new function scope
    const newScope = {};
    for (const arg of evaluatedArgs) {
      newScope[arg.name] = arg.value;
    }
    this.scopes.push(newScope);

    try {
      this.execute(func.body);
    } catch (err) {
      if (err instanceof ReturnSignal) {
        return err.value;
      }
      throw err;
    } finally {
      // Pop the scope to restore execution environment
      this.scopes.pop();
    }

    return null;
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

      this.declareVariable(node.name, val);
      return;
    }

    if (node.type === "PrintStatement") {
      const val = this.evaluate(node.value);
      this.output(val);
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

    if (node.type === "BlockStatement") {
      for (const statement of node.body) {
        this.execute(statement);
      }
      return;
    }

    if (node.type === "LoopStatement") {
      while (this.evaluate(node.condition)) {
        this.execute(node.body);
      }
      return;
    }

    if (node.type === "VariableAssignment") {
      const existingVal = this.getVariable(node.name, node.line);
      const val = this.evaluate(node.value);
      
      let expectedTypeLabel = "";
      if (typeof existingVal === "number") expectedTypeLabel = "angka";
      else if (typeof existingVal === "string") expectedTypeLabel = "teks";
      else if (typeof existingVal === "boolean") expectedTypeLabel = "boolean";

      if (typeof val !== typeof existingVal) {
        throw new Error(`Error Runtime [Baris ${node.line}]: Tipe data tidak cocok. Variabel "${node.name}" dideklarasikan sebagai "${expectedTypeLabel}", tetapi Anda mengisinya dengan tipe "${typeof val}" (${JSON.stringify(val)}).`);
      }
      this.assignVariable(node.name, val, node.line);
      return;
    }

    if (node.type === "FunctionDeclaration") {
      this.functions[node.name] = node;
      return;
    }

    if (node.type === "FunctionCallStatement") {
      this.executeFunctionCall(node);
      return;
    }

    if (node.type === "ReturnStatement") {
      const val = node.value ? this.evaluate(node.value) : null;
      throw new ReturnSignal(val, node.line);
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
      return this.getVariable(node.value, node.line);
    }

    if (node.type === "FunctionCallExpression") {
      return this.executeFunctionCall(node);
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