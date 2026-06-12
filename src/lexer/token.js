// src/lexer/token.js
// Token definitions and a simple Token container used by the lexer and parser.

const TokenType = {
  // Keywords / statements
  PRINT: "PRINT",
  IF: "IF",
  THEN: "THEN",
  ELSE: "ELSE",
  WHILE: "WHILE",
  DO: "DO",
  LBRACE: "LBRACE",
  RBRACE: "RBRACE",
  FUNCTION: "FUNCTION",
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  COMMA: "COMMA",
  RETURN: "RETURN",

  // Declarations / types
  CREATE: "CREATE",
  TEXT_TYPE: "TEXT_TYPE",
  NUMBER_TYPE: "NUMBER_TYPE",

  // Boolean
  BOOLEAN_TYPE: "BOOLEAN_TYPE",
  TRUE: "TRUE",
  FALSE: "FALSE",

  // Literals and identifiers
  IDENTIFIER: "IDENTIFIER",
  STRING: "STRING",
  NUMBER: "NUMBER",

  // Operators / punctuation
  EQUALS: "EQUALS",
  PLUS: "PLUS",
  MINUS: "MINUS",
  STAR: "STAR",
  SLASH: "SLASH",
  GT: "GT",
  LT: "LT",
  GTE: "GTE",
  LTE: "LTE",
  EQ: "EQ",
  NEQ: "NEQ",

  // End of file
  EOF: "EOF",
};

// Simple Token class carries type, optional value and position info.
class Token {
  constructor(type, value = null, line = 1, column = 1) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

module.exports = {
  TokenType,
  Token,
};