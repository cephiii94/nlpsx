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
    parseExpression() {
    let left = this.currentToken();

    if (
        left.type !== TokenType.STRING &&
        left.type !== TokenType.NUMBER &&
        left.type !== TokenType.IDENTIFIER
    ) {
        throw new Error(`Expected expression, but got ${left.type}`);
    }

    this.advance();

    if (this.currentToken().type === TokenType.PLUS) {
        this.advance();

        const right = this.currentToken();

        if (
        right.type !== TokenType.NUMBER &&
        right.type !== TokenType.IDENTIFIER
        ) {
        throw new Error(`Expected NUMBER or IDENTIFIER after PLUS, but got ${right.type}`);
        }

        this.advance();

        return {
        type: "BinaryExpression",
        operator: "+",
        left: {
            type: left.type,
            value: left.value,
        },
        right: {
            type: right.type,
            value: right.value,
        },
        };
    }

    return {
        type: left.type,
        value: left.value,
    };
    }

    parseVariableDeclaration() {
    this.consume(TokenType.CREATE);

    const dataTypeToken = this.currentToken();

    if (
        dataTypeToken.type !== TokenType.TEXT_TYPE &&
        dataTypeToken.type !== TokenType.NUMBER_TYPE
    ) {
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
        value: value,
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