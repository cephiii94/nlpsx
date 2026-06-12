// src/lexer/lexer.js

const { TokenType, Token } = require("./token");

class Lexer {
  constructor(source) {
    this.source = source;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  currentChar() {
    if (this.position >= this.source.length) {
      return null;
    }

    return this.source[this.position];
  }

  advance() {
    const char = this.currentChar();

    this.position++;
    if (char === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }

    return char;
  }

  skipWhitespace() {
    while (
        this.currentChar() !== null &&
        /\s/.test(this.currentChar())
    ) {
        this.advance();
    }
  }

  readWord() {
    let word = "";
    const startLine = this.line;
    const startColumn = this.column;

    while (
        this.currentChar() !== null &&
        /[a-zA-Z_]/.test(this.currentChar())
    ) {
        word += this.advance();
    }

    let type = TokenType.IDENTIFIER;
    let value = word;

    if (word === "tampilkan") type = TokenType.PRINT;
    else if (word === "buat") type = TokenType.CREATE;
    else if (word === "teks") type = TokenType.TEXT_TYPE;
    else if (word === "angka") type = TokenType.NUMBER_TYPE;
    else if (word === "boolean") type = TokenType.BOOLEAN_TYPE;
    else if (word === "benar") { type = TokenType.TRUE; value = true; }
    else if (word === "salah") { type = TokenType.FALSE; value = false; }
    else if (word === "jika") type = TokenType.IF;
    else if (word === "maka") type = TokenType.THEN;
    else if (word === "selain") type = TokenType.ELSE;

    return new Token(type, value, startLine, startColumn);
  }

  readString() {
    let text = "";
    const startLine = this.line;
    const startColumn = this.column;

    this.advance(); // consume opening quote

    while (this.currentChar() !== null && this.currentChar() !== '"') {
      const char = this.currentChar();
      if (char === "\\") {
        this.advance(); // consume '\\'
        const nextChar = this.currentChar();
        if (nextChar === "n") {
          text += "\n";
        } else if (nextChar === "t") {
          text += "\t";
        } else if (nextChar === '"') {
          text += '"';
        } else if (nextChar === "\\") {
          text += "\\";
        } else {
          text += "\\" + nextChar; // fallback
        }
        this.advance(); // consume escaped char
      } else {
        text += this.advance();
      }
    }

    if (this.currentChar() !== '"') {
      throw new Error(`Error Sintaks [Baris ${startLine}, Kolom ${startColumn}]: Teks/String belum ditutup dengan tanda kutip ganda ("). Pastikan setiap teks dibuka dan ditutup dengan tanda kutip ganda.`);
    }

    this.advance(); // consume closing quote

    return new Token(TokenType.STRING, text, startLine, startColumn);
  }

  readNumber() {
    let number = "";
    const startLine = this.line;
    const startColumn = this.column;

    while (
        this.currentChar() !== null &&
        /[0-9]/.test(this.currentChar())
    ) {
        number += this.advance();
    }

    // Check if there is a decimal point
    if (this.currentChar() === "." && /[0-9]/.test(this.source[this.position + 1])) {
        number += this.advance(); // consume '.'
        while (
            this.currentChar() !== null &&
            /[0-9]/.test(this.currentChar())
        ) {
            number += this.advance();
        }
    }

    return new Token(
        TokenType.NUMBER,
        Number(number),
        startLine,
        startColumn
    );
  }

  getNextToken() {
    this.skipWhitespace();

    const startLine = this.line;
    const startColumn = this.column;
    const char = this.currentChar();

    if (char === null) {
      return new Token(TokenType.EOF, null, startLine, startColumn);
    }

    if (/[a-zA-Z_]/.test(char)) {
      return this.readWord();
    }

    if (char === '"') {
      return this.readString();
    }

    if (char === "=") {
      this.advance();
      if (this.currentChar() === "=") {
        this.advance();
        return new Token(TokenType.EQ, "==", startLine, startColumn);
      }
      return new Token(TokenType.EQUALS, "=", startLine, startColumn);
    }

    if (char === ">") {
      this.advance();
      if (this.currentChar() === "=") {
        this.advance();
        return new Token(TokenType.GTE, ">=", startLine, startColumn);
      }
      return new Token(TokenType.GT, ">", startLine, startColumn);
    }

    if (char === "<") {
      this.advance();
      if (this.currentChar() === "=") {
        this.advance();
        return new Token(TokenType.LTE, "<=", startLine, startColumn);
      }
      return new Token(TokenType.LT, "<", startLine, startColumn);
    }

    if (char === "!") {
      this.advance();
      if (this.currentChar() === "=") {
        this.advance();
        return new Token(TokenType.NEQ, "!=", startLine, startColumn);
      }
      throw new Error(`Error Sintaks [Baris ${startLine}, Kolom ${startColumn}]: Karakter "!" tidak dikenal. Apakah Anda ingin menulis perbandingan tidak sama dengan ("!=")?`);
    }

    if (/[0-9]/.test(char)) {
        return this.readNumber();
    }

    if (char === "+") {
      this.advance();
      return new Token(TokenType.PLUS, "+", startLine, startColumn);
    }

    if (char === "-") {
      this.advance();
      return new Token(TokenType.MINUS, "-", startLine, startColumn);
    }

    if (char === "*") {
      this.advance();
      return new Token(TokenType.STAR, "*", startLine, startColumn);
    }

    if (char === "/") {
      this.advance();
      return new Token(TokenType.SLASH, "/", startLine, startColumn);
    }

    throw new Error(`Error Sintaks [Baris ${startLine}, Kolom ${startColumn}]: Karakter "${char}" tidak dikenal dalam bahasa NLPSX.`);
  }

  tokenize() {
    const tokens = [];

    let token = this.getNextToken();

    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }

    tokens.push(token);

    return tokens;
  }
}

module.exports = Lexer;