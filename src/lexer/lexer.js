// src/lexer/lexer.js
// A simple lexer for the NLPSX language. Converts source text into tokens
// consumed by the parser. Error messages are in Indonesian to match the
// project's existing style.

const { TokenType, Token } = require("./token");

class Lexer {
  constructor(source) {
    this.source = source;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  // Return the current character or null when at end of input.
  currentChar() {
    if (this.position >= this.source.length) {
      return null;
    }

    return this.source[this.position];
  }

  // Advance the lexer's position by one character and return the previous char.
  advance() {
    const char = this.currentChar();
    this.position++;
    this.column++;
    return char;
  }

  // Skip whitespace characters (spaces, tabs, newlines).
  skipWhitespace() {
    while (this.currentChar() !== null && /\s/.test(this.currentChar())) {
      this.advance();
    }
  }

  // Read an identifier or keyword (letters and underscore only).
  // Recognizes language keywords and returns the appropriate token.
  readWord() {
    let word = "";

    while (this.currentChar() !== null && /[a-zA-Z_]/.test(this.currentChar())) {
      word += this.advance();
    }

    // Keywords in Indonesian
    if (word === "tampilkan") {
      return new Token(TokenType.PRINT, word);
    }

    if (word === "buat") {
      return new Token(TokenType.CREATE, word);
    }

    if (word === "teks") {
      return new Token(TokenType.TEXT_TYPE, word);
    }

    if (word === "angka") {
      return new Token(TokenType.NUMBER_TYPE, word);
    }

    return new Token(TokenType.IDENTIFIER, word);
  }

  // Read a double-quoted string literal. Throws if closing quote is missing.
  readString() {
    let text = "";
    const startColumn = this.column;

    // consume opening quote
    this.advance();

    while (this.currentChar() !== null && this.currentChar() !== '"') {
      text += this.advance();
    }

    if (this.currentChar() !== '"') {
      throw new Error("Teks belum ditutup dengan tanda kutip.");
    }

    // consume closing quote
    this.advance();

    return new Token(TokenType.STRING, text, this.line, startColumn);
  }

  // Read an integer number (sequence of digits).
  readNumber() {
    let number = "";

    while (this.currentChar() !== null && /[0-9]/.test(this.currentChar())) {
      number += this.advance();
    }

    return new Token(TokenType.NUMBER, Number(number));
  }

  // Produce the next token from input or EOF.
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

    if (/[0-9]/.test(char)) {
      return this.readNumber();
    }

    if (char === "+") {
      this.advance();
      return new Token(TokenType.PLUS, "+");
    }

    throw new Error(`Karakter tidak dikenal: ${char}`);
  }

  // Tokenize the entire input into an array of tokens.
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