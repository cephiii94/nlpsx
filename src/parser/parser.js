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
      if (expectedType === TokenType.THEN) {
        friendlyMessage += `. Tips: Anda menulis pernyataan "jika" tetapi lupa menulis kata kunci "maka" sebelum isi pernyataan.`;
      } else if (expectedType === TokenType.DO) {
        friendlyMessage += `. Tips: Anda menulis pernyataan perulangan "selama" tetapi lupa menulis kata kunci "lakukan" setelah kondisi.`;
      } else if (expectedType === TokenType.SELESAI) {
        friendlyMessage += `. Tips: Pastikan Anda menutup blok perulangan/kondisi/fungsi dengan kata penutup "selesai".`;
      } else if (expectedType === TokenType.IS) {
        friendlyMessage += `. Tips: Pastikan Anda menulis kata kunci "adalah" untuk deklarasi nilai variabel.`;
      } else if (expectedType === TokenType.RPAREN) {
        friendlyMessage += `. Tips: Pastikan Anda menutup tanda kurung dengan kurung tutup ")".`;
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

  parsePrimaryExpression() {
    const token = this.currentToken();

    if (token.type === TokenType.IDENTIFIER) {
      const nextToken = this.tokens[this.position + 1];
      if (nextToken && nextToken.type === TokenType.LPAREN) {
        this.advance(); // consume identifier name
        this.consume(TokenType.LPAREN);
        const args = [];
        if (this.currentToken().type !== TokenType.RPAREN) {
          do {
            args.push(this.parseExpression());
            if (this.currentToken().type === TokenType.COMMA) {
              this.consume(TokenType.COMMA);
            } else {
              break;
            }
          } while (this.currentToken().type !== TokenType.EOF);
        }
        this.consume(TokenType.RPAREN);
        return {
          type: "FunctionCallExpression",
          name: token.value,
          args,
          line: token.line,
          column: token.column
        };
      }
    }

    const allowedTypes = [
      TokenType.STRING,
      TokenType.NUMBER,
      TokenType.IDENTIFIER,
      TokenType.TRUE,
      TokenType.FALSE
    ];

    if (!allowedTypes.includes(token.type)) {
      let friendlyMessage = `Error Sintaks [Baris ${token.line}, Kolom ${token.column}]: Nilai atau simbol "${token.value || token.type}" tidak valid sebagai bagian dari ekspresi.`;
      if (token.type === TokenType.DO) {
        friendlyMessage += ` Tips: Anda menulis "selama" diikuti langsung oleh "lakukan". Pastikan Anda menulis kondisi perulangan (seperti "i <= 5") di antara keduanya.`;
      }
      throw new Error(friendlyMessage);
    }

    this.advance();
    return { type: token.type, value: token.value, line: token.line, column: token.column };
  }

  // Parse a literal/identifier or a simple binary expression.
  parseExpression() {
    const leftToken = this.currentToken();

    // Support unary negation, e.g. -5
    if (leftToken.type === TokenType.MINUS) {
      this.advance();
      const operand = this.parseExpression();
      return {
        type: "UnaryExpression",
        operator: "-",
        right: operand,
        line: leftToken.line,
        column: leftToken.column
      };
    }

    let left = this.parsePrimaryExpression();

    while (true) {
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
        TokenType.NEQ,
        TokenType.IS
      ].includes(nextToken.type);

      if (!isBinaryOperator) {
        break;
      }

      this.advance();
      const right = this.parsePrimaryExpression();
      const op = nextToken.type === TokenType.IS ? "==" : nextToken.value;
      left = {
        type: "BinaryExpression",
        operator: op,
        left,
        right,
        line: nextToken.line,
        column: nextToken.column
      };
    }

    return left;
  }

  // Parse a variable declaration: "<type> <identifier> adalah <expression>"
  parseVariableDeclaration() {
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
    this.consume(TokenType.IS);
    const value = this.parseExpression();

    return {
      type: "VariableDeclaration",
      dataType: dataTypeToken.value,
      name: nameToken.value,
      value,
      line: dataTypeToken.line,
      column: dataTypeToken.column
    };
  }

  parsePrintStatement() {
    const printToken = this.consume(TokenType.PRINT);
    const value = this.parseExpression();
    return {
      type: "PrintStatement",
      value,
      line: printToken.line,
      column: printToken.column
    };
  }

  // Parse an if statement: "jika <expression> maka <statement>* [jika tidak <statement>*] selesai"
  parseIfStatement() {
    const ifToken = this.consume(TokenType.IF);
    const condition = this.parseExpression();
    this.consume(TokenType.THEN);
    
    const consequentBody = [];
    while (
      this.currentToken().type !== TokenType.ELSE && 
      this.currentToken().type !== TokenType.SELESAI && 
      this.currentToken().type !== TokenType.EOF
    ) {
      if (this.currentToken().type === TokenType.SEMICOLON) {
        this.advance();
        continue;
      }
      consequentBody.push(this.parseStatement());
    }
    
    const consequent = {
      type: "BlockStatement",
      body: consequentBody,
      line: ifToken.line,
      column: ifToken.column
    };
    
    let alternate = null;
    if (this.currentToken().type === TokenType.ELSE) {
      this.consume(TokenType.ELSE);
      const alternateBody = [];
      while (
        this.currentToken().type !== TokenType.SELESAI && 
        this.currentToken().type !== TokenType.EOF
      ) {
        if (this.currentToken().type === TokenType.SEMICOLON) {
          this.advance();
          continue;
        }
        alternateBody.push(this.parseStatement());
      }
      alternate = {
        type: "BlockStatement",
        body: alternateBody,
        line: ifToken.line,
        column: ifToken.column
      };
    }
    
    this.consume(TokenType.SELESAI);

    return {
      type: "IfStatement",
      condition,
      consequent,
      alternate,
      line: ifToken.line,
      column: ifToken.column
    };
  }

  parseBlock(beginToken) {
    const body = [];
    while (this.currentToken().type !== TokenType.SELESAI && this.currentToken().type !== TokenType.EOF) {
      if (this.currentToken().type === TokenType.SEMICOLON) {
        this.advance();
        continue;
      }
      body.push(this.parseStatement());
    }
    this.consume(TokenType.SELESAI);
    return {
      type: "BlockStatement",
      body,
      line: beginToken.line,
      column: beginToken.column
    };
  }

  parseLoopStatement() {
    const loopToken = this.consume(TokenType.WHILE);
    const condition = this.parseExpression();
    this.consume(TokenType.DO);
    const body = this.parseBlock(loopToken);
    return {
      type: "LoopStatement",
      condition,
      body,
      line: loopToken.line,
      column: loopToken.column
    };
  }

  parseVariableAssignment() {
    const nameToken = this.consume(TokenType.IDENTIFIER);
    this.consume(TokenType.EQUALS);
    const value = this.parseExpression();
    return {
      type: "VariableAssignment",
      name: nameToken.value,
      value,
      line: nameToken.line,
      column: nameToken.column
    };
  }

  parseFunctionDeclaration() {
    const funcToken = this.consume(TokenType.FUNCTION);
    const nameToken = this.consume(TokenType.IDENTIFIER);
    
    this.consume(TokenType.LPAREN);
    const params = [];
    if (this.currentToken().type !== TokenType.RPAREN) {
      do {
        const typeToken = this.currentToken();
        if (
          typeToken.type !== TokenType.TEXT_TYPE &&
          typeToken.type !== TokenType.NUMBER_TYPE &&
          typeToken.type !== TokenType.BOOLEAN_TYPE
        ) {
          throw new Error(`Error Sintaks [Baris ${typeToken.line}, Kolom ${typeToken.column}]: Tipe data parameter "${typeToken.value || typeToken.type}" tidak dikenal. Gunakan "teks", "angka", atau "boolean".`);
        }
        this.advance();
        const paramNameToken = this.consume(TokenType.IDENTIFIER);
        params.push({
          type: typeToken.value,
          name: paramNameToken.value,
          line: typeToken.line,
          column: typeToken.column
        });
        
        if (this.currentToken().type === TokenType.COMMA) {
          this.consume(TokenType.COMMA);
        } else {
          break;
        }
      } while (this.currentToken().type !== TokenType.EOF);
    }
    this.consume(TokenType.RPAREN);
    
    const body = this.parseBlock(funcToken);
    
    return {
      type: "FunctionDeclaration",
      name: nameToken.value,
      params,
      body,
      line: funcToken.line,
      column: funcToken.column
    };
  }

  parseFunctionCallStatement() {
    const nameToken = this.consume(TokenType.IDENTIFIER);
    this.consume(TokenType.LPAREN);
    const args = [];
    if (this.currentToken().type !== TokenType.RPAREN) {
      do {
        args.push(this.parseExpression());
        if (this.currentToken().type === TokenType.COMMA) {
          this.consume(TokenType.COMMA);
        } else {
          break;
        }
      } while (this.currentToken().type !== TokenType.EOF);
    }
    this.consume(TokenType.RPAREN);
    return {
      type: "FunctionCallStatement",
      name: nameToken.value,
      args,
      line: nameToken.line,
      column: nameToken.column
    };
  }

  parseReturnStatement() {
    const returnToken = this.consume(TokenType.RETURN);
    const token = this.currentToken();
    const canStartExpression = [
      TokenType.STRING,
      TokenType.NUMBER,
      TokenType.IDENTIFIER,
      TokenType.TRUE,
      TokenType.FALSE,
      TokenType.MINUS
    ].includes(token.type);

    let value = null;
    if (canStartExpression) {
      value = this.parseExpression();
    }

    return {
      type: "ReturnStatement",
      value,
      line: returnToken.line,
      column: returnToken.column
    };
  }

  // Parse a single statement based on the next token.
  parseStatement() {
    const token = this.currentToken();

    if (
      token.type === TokenType.TEXT_TYPE ||
      token.type === TokenType.NUMBER_TYPE ||
      token.type === TokenType.BOOLEAN_TYPE
    ) {
      return this.parseVariableDeclaration();
    }
    if (token.type === TokenType.PRINT) return this.parsePrintStatement();
    if (token.type === TokenType.IF) return this.parseIfStatement();
    if (token.type === TokenType.WHILE) return this.parseLoopStatement();
    if (token.type === TokenType.FUNCTION) return this.parseFunctionDeclaration();
    if (token.type === TokenType.RETURN) return this.parseReturnStatement();
    if (token.type === TokenType.IDENTIFIER) {
      const nextToken = this.tokens[this.position + 1];
      if (nextToken && nextToken.type === TokenType.EQUALS) {
        return this.parseVariableAssignment();
      }
      if (nextToken && nextToken.type === TokenType.LPAREN) {
        return this.parseFunctionCallStatement();
      }
    }

    throw new Error(`Error Sintaks [Baris ${token.line}, Kolom ${token.column}]: Pernyataan "${token.value || token.type}" tidak dikenal. Gunakan tipe data "angka", "teks", atau "boolean" untuk deklarasi variabel, "tampilkan" untuk mencetak output, "jika" untuk kondisi, "selama" untuk perulangan, "fungsi" untuk fungsi, atau "kembalikan" untuk mengembalikan nilai.`);
  }

  // Parse the whole token stream into a Program AST node.
  parse() {
    const body = [];

    while (this.currentToken().type !== TokenType.EOF) {
      if (this.currentToken().type === TokenType.SEMICOLON) {
        this.advance();
        continue;
      }
      body.push(this.parseStatement());
    }

    return { type: "Program", body };
  }
}

module.exports = Parser;