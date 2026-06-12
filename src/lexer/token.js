// src/lexer/token.js

const TokenType = {
  PRINT: "PRINT",
  STRING: "STRING",
  EOF: "EOF",
};

class Token {
  constructor(type, value = null, line = 1, column = 1) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

module.exports = {
  TokenType,
  Token,
};