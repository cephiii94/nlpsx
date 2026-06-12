# NLPSX Architecture

NLPSX follows an interpreter-based architecture.

File .nlpsx
↓
Lexer
↓
Parser
↓
AST
↓
Interpreter
↓
Output

## Components

### Lexer
Converts source code into tokens.

### Parser
Builds an Abstract Syntax Tree (AST).

### AST
Internal representation of program structure.

### Interpreter
Executes AST nodes.

### Output
Displays results to the user.