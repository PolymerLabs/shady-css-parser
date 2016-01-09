
class Token {
  constructor(type, start, offset) {
    this.type = type;
    this.start = start;
    this.offset = offset;
  }

  is(type) {
    return (this.type & type) === type;
  }
}

Token.type = {
  whitespace: 1,
  string: 2,
  comment: 4,
  word: 8,
  boundary: 16,
  propertyBoundary: 32,
  // Special cases for boundary:
  openParenthesis: 64 | 16,
  closeParenthesis: 128 | 16,
  at: 256 | 16,
  openBrace: 512 | 16,
  // [};] are property boundaries:
  closeBrace: 1024 | 32 | 16,
  semicolon: 2048 | 32 | 16,
};

const boundaryTokenTypes = {
  '(': Token.type.openParenthesis,
  ')': Token.type.closeParenthesis,
  ':': Token.type.colon,
  '@': Token.type.at,
  '{': Token.type.openBrace,
  '}': Token.type.closeBrace,
  ';': Token.type.semicolon,
  '-': Token.type.hyphen,
  '_': Token.type.underscore
};

export { Token, boundaryTokenTypes };
