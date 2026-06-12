const fs = require("fs");
const path = require("path");

const Lexer = require("./lexer/lexer");
const Parser = require("./parser/parser");
const Interpreter = require("./interpreter/interpreter");

const filePath = path.join(__dirname, "../examples/hello.nlpsx");
const source = fs.readFileSync(filePath, "utf8");

const lexer = new Lexer(source);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
interpreter.run();