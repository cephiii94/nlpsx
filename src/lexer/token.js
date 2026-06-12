// src/lexer/token.js

const TokenType = {
  PRINT: "PRINT",

  CREATE: "CREATE",
  TEXT_TYPE: "TEXT_TYPE",

  IDENTIFIER: "IDENTIFIER",
  EQUALS: "EQUALS",
  PLUS: "PLUS",
  NUMBER: "NUMBER",
  NUMBER_TYPE: "NUMBER_TYPE",

  STRING: "STRING",
  EOF: "EOF"
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