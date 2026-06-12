const { TokenType } = require("../lexer/token");

// Parser converts a token stream into a simple AST used by the interpreter.
// The grammar is intentionally minimal: variable declarations, print statements
// and simple binary addition expressions.
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  // Return the token at the current position.
  currentToken() {
    return this.tokens[this.position];
  }

  // Advance the token pointer by one.
  advance() {
    this.position++;
  }

  // Consume a token of the expected type, advancing the pointer.
  // Throws if the next token doesn't match the expectation.
  consume(expectedType) {
    const token = this.currentToken();

    if (!token || token.type !== expectedType) {
      throw new Error(`Expected ${expectedType}, but got ${token?.type}`);
    }

    this.advance();
    return token;
  }

  // Parse a literal/identifier or a simple binary addition expression.
  parseExpression() {
    const left = this.currentToken();

    if (
      left.type !== TokenType.STRING &&
      left.type !== TokenType.NUMBER &&
      left.type !== TokenType.IDENTIFIER
    ) {
      throw new Error(`Expected expression, but got ${left.type}`);
    }

    this.advance();

    // Support expressions of the form <left> + <right>
    if (this.currentToken().type === TokenType.PLUS) {
      this.advance();
      const right = this.currentToken();

      if (right.type !== TokenType.NUMBER && right.type !== TokenType.IDENTIFIER) {
        throw new Error(`Expected NUMBER or IDENTIFIER after PLUS, but got ${right.type}`);
      }

      this.advance();

      return {
        type: "BinaryExpression",
        operator: "+",
        left: { type: left.type, value: left.value },
        right: { type: right.type, value: right.value },
      };
    }

    // Single literal or identifier
    return { type: left.type, value: left.value };
  }

  // Parse a variable declaration: "buat <type> <identifier> = <expression>"
  parseVariableDeclaration() {
    this.consume(TokenType.CREATE);

    const dataTypeToken = this.currentToken();

    if (dataTypeToken.type !== TokenType.TEXT_TYPE && dataTypeToken.type !== TokenType.NUMBER_TYPE) {
      throw new Error(`Expected TEXT_TYPE or NUMBER_TYPE, but got ${dataTypeToken.type}`);
    }

    this.advance();
    const nameToken = this.consume(TokenType.IDENTIFIER);
    this.consume(TokenType.EQUALS);
    const value = this.parseExpression();

    return {
      type: "VariableDeclaration",
      dataType: dataTypeToken.value,
      name: nameToken.value,
      value,
    };
  }

  // Parse a print statement: "tampilkan <string|identifier>"
  parsePrintStatement() {
    this.consume(TokenType.PRINT);
    const token = this.currentToken();

    if (token.type === TokenType.STRING) {
      const stringToken = this.consume(TokenType.STRING);
      return { type: "PrintStatement", valueType: "string", value: stringToken.value };
    }

    if (token.type === TokenType.IDENTIFIER) {
      const identifierToken = this.consume(TokenType.IDENTIFIER);
      return { type: "PrintStatement", valueType: "identifier", value: identifierToken.value };
    }

    throw new Error(`Expected STRING or IDENTIFIER, but got ${token.type}`);
  }

  // Parse a single statement based on the next token.
  parseStatement() {
    const token = this.currentToken();

    if (token.type === TokenType.CREATE) return this.parseVariableDeclaration();
    if (token.type === TokenType.PRINT) return this.parsePrintStatement();

    throw new Error(`Statement tidak dikenal: ${token.type}`);
  }

  // Parse the whole token stream into a Program AST node.
  parse() {
    const body = [];

    while (this.currentToken().type !== TokenType.EOF) {
      body.push(this.parseStatement());
    }

    return { type: "Program", body };
  }
}

module.exports = Parser;