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
      throw new Error(`Expected ${expectedType}, but got ${token?.type}`);
    }

    this.advance();
    return token;
  }

  parseVariableDeclaration() {
    this.consume(TokenType.CREATE);
    this.consume(TokenType.TEXT_TYPE);

    const nameToken = this.consume(TokenType.IDENTIFIER);

    this.consume(TokenType.EQUALS);

    const valueToken = this.consume(TokenType.STRING);

    return {
      type: "VariableDeclaration",
      dataType: "teks",
      name: nameToken.value,
      value: valueToken.value,
    };
  }

  parsePrintStatement() {
    this.consume(TokenType.PRINT);

    const token = this.currentToken();

    if (token.type === TokenType.STRING) {
      const stringToken = this.consume(TokenType.STRING);

      return {
        type: "PrintStatement",
        valueType: "string",
        value: stringToken.value,
      };
    }

    if (token.type === TokenType.IDENTIFIER) {
      const identifierToken = this.consume(TokenType.IDENTIFIER);

      return {
        type: "PrintStatement",
        valueType: "identifier",
        value: identifierToken.value,
      };
    }

    throw new Error(`Expected STRING or IDENTIFIER, but got ${token.type}`);
  }

  parseStatement() {
    const token = this.currentToken();

    if (token.type === TokenType.CREATE) {
      return this.parseVariableDeclaration();
    }

    if (token.type === TokenType.PRINT) {
      return this.parsePrintStatement();
    }

    throw new Error(`Statement tidak dikenal: ${token.type}`);
  }

  parse() {
    const body = [];

    while (this.currentToken().type !== TokenType.EOF) {
      body.push(this.parseStatement());
    }

    return {
      type: "Program",
      body,
    };
  }
}

module.exports = Parser;