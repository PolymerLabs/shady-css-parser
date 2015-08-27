import { matcher, tokenType, traverseWhitespace } from './common';

function Whitespace(source, offset) {
  let start = offset;

  offset = traverseWhitespace(source, offset);

  if (offset > start) {
    return [
      source.substr(start, offset - start),
      tokenType.whitespace,
      offset
    ];
  }

  return [
    null,
    tokenType.none,
    offset
  ];
}

function Boundary(source, offset) {
  let token;

  if (matcher.boundary.test(source[offset])) {
    return [
      source[offset],
      tokenType.boundary,
      offset + 1
    ];
  }

  return [
    null,
    tokenType.none,
    offset
  ];
}

function StringValue(source, offset) {
  let quotation = source[offset];
  let escaped = false;
  let start = offset;
  let character;

  if (!matcher.quotation.test(quotation)) {
    throw new Error('Expected quotation mark, but got ' + quotation + ' at ' + offset);
  }

  while (character = source[++offset]) {
    if (escaped) {
      escaped = false;
      continue;
    }

    if (character === quotation) {
      ++offset;

      return [
        source.substr(start, offset - start),
        tokenType.string,
        offset
      ];
    }

    if (character === '\\') {
      escaped = true;
    }
  }

  return [
    null,
    tokenType.none,
    offset
  ];
}

function Word(source, offset) {
  let word = null;
  let character;

  while ((character = source[offset]) && !matcher.boundary.test(character)) {
    word = word || '';
    word += character;
    ++offset;
  }

  return [
    word,
    word == null ? tokenType.none : tokenType.word,
    offset
  ];
}

function Token(source, offset) {
  let token = Whitespace(source, offset);

  if (token[0]) {
    return token;
  }

  token = Boundary(source, token[2]);

  switch(token[0]) {
    case null:
      break;
    case '"':
    case '\'':
      return StringValue(source, token[2] - 1);
    default:
      return token;
  }

  return Word(source, token[2]);
}

function lex(source) {
  let tokens = [];
  let offset = 0;
  let token;

  while ((token = Token(source, offset)) && token[0] != null) {
    tokens.push(token);
    offset = token[2];
  }

  return tokens;
}

export { lex };
