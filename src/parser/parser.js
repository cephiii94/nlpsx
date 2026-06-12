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
  // Consume a token of the expected type, advancing the pointer.
  // Throws a detailed syntax error if the next token doesn't match.
  consume(expectedType) {
    const token = this.currentToken();

    if (!token || token.type !== expectedType) {
      const positionInfo = token 
        ? `di Baris ${token.line}, Kolom ${token.column}`
        : "di akhir file (EOF)";
      throw new Error(`Error Sintaks: Mengharapkan token tipe "${expectedType}", tetapi mendapatkan "${token?.type || 'EOF'}" ${positionInfo}`);
    }

    this.advance();
    return token;
  }

  // Parse a literal/identifier or a simple binary expression.
  parseExpression() {
    const left = this.currentToken();

    const allowedLeftTypes = [
      TokenType.STRING,
      TokenType.NUMBER,
      TokenType.IDENTIFIER,
      TokenType.TRUE,
      TokenType.FALSE
    ];

    if (!allowedLeftTypes.includes(left.type)) {
      throw new Error(`Error Sintaks: Token tipe "${left.type}" tidak valid sebagai bagian dari ekspresi di Baris ${left.line}, Kolom ${left.column}`);
    }

    this.advance();

    const nextToken = this.currentToken();
    const isBinaryOperator = [
      TokenType.PLUS,
      TokenType.GT,
      TokenType.LT,
      TokenType.GTE,
      TokenType.LTE,
      TokenType.EQ,
      TokenType.NEQ
    ].includes(nextToken.type);

    if (isBinaryOperator) {
      this.advance();
      const right = this.currentToken();

      const allowedRightTypes = [
        TokenType.STRING,
        TokenType.NUMBER,
        TokenType.IDENTIFIER,
        TokenType.TRUE,
        TokenType.FALSE
      ];

      if (!allowedRightTypes.includes(right.type)) {
        throw new Error(`Error Sintaks: Mengharapkan operand setelah operator "${nextToken.value}" di Baris ${nextToken.line}, Kolom ${nextToken.column}, tetapi mendapatkan "${right.type}"`);
      }

      this.advance();

      return {
        type: "BinaryExpression",
        operator: nextToken.value,
        left: { type: left.type, value: left.value, line: left.line, column: left.column },
        right: { type: right.type, value: right.value, line: right.line, column: right.column },
        line: nextToken.line,
        column: nextToken.column
      };
    }

    // Single literal or identifier
    return { type: left.type, value: left.value, line: left.line, column: left.column };
  }

  // Parse a variable declaration: "buat <type> <identifier> = <expression>"
  parseVariableDeclaration() {
    const createToken = this.consume(TokenType.CREATE);

    const dataTypeToken = this.currentToken();

    if (
      dataTypeToken.type !== TokenType.TEXT_TYPE &&
      dataTypeToken.type !== TokenType.NUMBER_TYPE &&
      dataTypeToken.type !== TokenType.BOOLEAN_TYPE
    ) {
      throw new Error(`Error Sintaks: Mengharapkan tipe data (teks, angka, atau boolean) di Baris ${dataTypeToken.line}, Kolom ${dataTypeToken.column}, tetapi mendapatkan "${dataTypeToken.value || dataTypeToken.type}"`);
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
      line: createToken.line,
      column: createToken.column
    };
  }

  // Parse a print statement: "tampilkan <string|identifier>"
  parsePrintStatement() {
    const printToken = this.consume(TokenType.PRINT);
    const token = this.currentToken();

    if (token.type === TokenType.STRING) {
      const stringToken = this.consume(TokenType.STRING);
      return {
        type: "PrintStatement",
        valueType: "string",
        value: stringToken.value,
        line: printToken.line,
        column: printToken.column
      };
    }

    if (token.type === TokenType.IDENTIFIER) {
      const identifierToken = this.consume(TokenType.IDENTIFIER);
      return {
        type: "PrintStatement",
        valueType: "identifier",
        value: identifierToken.value,
        line: printToken.line,
        column: printToken.column
      };
    }

    throw new Error(`Error Sintaks: "tampilkan" mengharapkan teks atau nama variabel di Baris ${token.line}, Kolom ${token.column}, tetapi mendapatkan "${token.type}"`);
  }

  // Parse an if statement: "jika <expression> maka <statement> [selain <statement>]"
  parseIfStatement() {
    const ifToken = this.consume(TokenType.IF);
    const condition = this.parseExpression();
    this.consume(TokenType.THEN);
    const consequent = this.parseStatement();
    let alternate = null;

    if (this.currentToken().type === TokenType.ELSE) {
      this.consume(TokenType.ELSE);
      alternate = this.parseStatement();
    }

    return {
      type: "IfStatement",
      condition,
      consequent,
      alternate,
      line: ifToken.line,
      column: ifToken.column
    };
  }

  // Parse a single statement based on the next token.
  parseStatement() {
    const token = this.currentToken();

    if (token.type === TokenType.CREATE) return this.parseVariableDeclaration();
    if (token.type === TokenType.PRINT) return this.parsePrintStatement();
    if (token.type === TokenType.IF) return this.parseIfStatement();

    throw new Error(`Error Sintaks: Pernyataan tidak dikenal "${token.value || token.type}" di Baris ${token.line}, Kolom ${token.column}`);
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