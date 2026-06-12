// src/parser/parser.js

const { TokenType } = require("../lexer/token");

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  currentToken() {
    return this.tokens[this.position];
  }

  advance() {
    this.position++;
  }

  consume(expectedType) {
    const token = this.currentToken();

    if (!token || token.type !== expectedType) {
      throw new Error(
        `Expected ${expectedType}, but got ${token?.type}`
      );
    }

    this.advance();

    return token;
  }

  parsePrintStatement() {
    this.consume(TokenType.PRINT);

    const stringToken = this.consume(TokenType.STRING);

    return {
      type: "PrintStatement",
      value: stringToken.value,
    };
  }

  parse() {
    const body = [];

    while (this.currentToken().type !== TokenType.EOF) {
      body.push(this.parsePrintStatement());
    }

    return {
      type: "Program",
      body,
    };
  }
}

module.exports = Parser;