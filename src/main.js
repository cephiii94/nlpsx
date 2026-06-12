const fs = require("fs");
const path = require("path");

const Lexer = require("./lexer/lexer");
const Parser = require("./parser/parser");
const Interpreter = require("./interpreter/interpreter");

// Ambil file dari argumen CLI jika ada, jika tidak gunakan default hello.nlpsx
const argPath = process.argv[2];
const filePath = argPath ? path.resolve(argPath) : path.join(__dirname, "../examples/hello.nlpsx");

if (!fs.existsSync(filePath)) {
  console.error(`Error: File tidak ditemukan di ${filePath}`);
  process.exit(1);
}

const source = fs.readFileSync(filePath, "utf8");

const lexer = new Lexer(source);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
interpreter.run();