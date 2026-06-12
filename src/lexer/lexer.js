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
    this.column++;

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

    while (
        this.currentChar() !== null &&
        /[a-zA-Z_]/.test(this.currentChar())
    ) {
        word += this.advance();
    }

    if (word === "tampilkan") {
        return new Token(TokenType.PRINT, word);
    }

    if (word === "buat") {
        return new Token(TokenType.CREATE, word);
    }

    if (word === "teks") {
        return new Token(TokenType.TEXT_TYPE, word);
    }

    return new Token(TokenType.IDENTIFIER, word);
    }
  readString() {
    let text = "";
    const startColumn = this.column;

    this.advance();

    while (this.currentChar() !== null && this.currentChar() !== '"') {
      text += this.advance();
    }

    if (this.currentChar() !== '"') {
      throw new Error("Teks belum ditutup dengan tanda kutip.");
    }

    this.advance();

    return new Token(TokenType.STRING, text, this.line, startColumn);
  }

  getNextToken() {
    this.skipWhitespace();

    const char = this.currentChar();

    if (char === null) {
      return new Token(TokenType.EOF, null, this.line, this.column);
    }

    if (/[a-zA-Z_]/.test(char)) {
      return this.readWord();
    }

    if (char === '"') {
      return this.readString();
    }

    if (char === "=") {
     this.advance();
     return new Token(TokenType.EQUALS, "=");
    }

    throw new Error(`Karakter tidak dikenal: ${char}`);
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