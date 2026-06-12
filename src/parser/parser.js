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
  // Throws a detailed and friendly syntax error if the next token doesn't match.
  consume(expectedType) {
    const token = this.currentToken();

    if (!token || token.type !== expectedType) {
      const positionInfo = token 
        ? `di Baris ${token.line}, Kolom ${token.column}`
        : "di akhir program (EOF)";
      
      let friendlyMessage = `Error Sintaks [${positionInfo}]: Mengharapkan simbol atau kata kunci "${expectedType}", tetapi mendapatkan "${token?.value || token?.type || 'EOF'}"`;
      
      // Custom helpful tips
      if (expectedType === TokenType.THEN && token?.type === TokenType.PRINT) {
        friendlyMessage += `. Tips: Anda menulis pernyataan "jika" tetapi lupa menulis kata kunci "maka" sebelum menulis "tampilkan".`;
      } else if (expectedType === TokenType.EQUALS) {
        friendlyMessage += `. Tips: Pastikan Anda menulis tanda "=" untuk mengisi nilai variabel.`;
      } else if (expectedType === TokenType.IDENTIFIER) {
        friendlyMessage += `. Tips: Pastikan Anda menulis nama variabel yang valid.`;
      }
      
      throw new Error(friendlyMessage);
    }

    this.advance();
    return token;
  }

  // Parse a literal/identifier or a simple binary expression.
  parseExpression() {
    const left = this.currentToken();

    // Support unary negation, e.g. -5
    if (left.type === TokenType.MINUS) {
      this.advance();
      const operand = this.parseExpression();
      return {
        type: "UnaryExpression",
        operator: "-",
        right: operand,
        line: left.line,
        column: left.column
      };
    }

    const allowedLeftTypes = [
      TokenType.STRING,
      TokenType.NUMBER,
      TokenType.IDENTIFIER,
      TokenType.TRUE,
      TokenType.FALSE
    ];

    if (!allowedLeftTypes.includes(left.type)) {
      throw new Error(`Error Sintaks [Baris ${left.line}, Kolom ${left.column}]: Nilai atau simbol "${left.value || left.type}" tidak valid sebagai bagian dari ekspresi.`);
    }

    this.advance();

    const nextToken = this.currentToken();
    const isBinaryOperator = [
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.STAR,
      TokenType.SLASH,
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
        throw new Error(`Error Sintaks [Baris ${nextToken.line}, Kolom ${nextToken.column}]: Mengharapkan nilai angka, teks, atau nama variabel setelah operator "${nextToken.value}", tetapi mendapatkan "${right.value || right.type}".`);
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
      throw new Error(`Error Sintaks [Baris ${dataTypeToken.line}, Kolom ${dataTypeToken.column}]: Tipe data "${dataTypeToken.value || dataTypeToken.type}" tidak dikenal. Gunakan kata kunci tipe "teks", "angka", atau "boolean".`);
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

    throw new Error(`Error Sintaks [Baris ${token.line}, Kolom ${token.column}]: Perintah "tampilkan" mengharapkan teks langsung di dalam tanda kutip atau nama variabel, tetapi mendapatkan "${token.value || token.type}".`);
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

    throw new Error(`Error Sintaks [Baris ${token.line}, Kolom ${token.column}]: Pernyataan "${token.value || token.type}" tidak dikenal. Gunakan kata kunci seperti "buat" untuk variabel, "tampilkan" untuk mencetak output, atau "jika" untuk kondisi.`);
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