let matcher = {
  whitespace: /\s/,
  commentOpen: /^\/\*/,
  commentClose: /\*\/$/,
  boundary: /[\(\)\{\}\[\]'"@;:\s\.+>~\^]|\/\*/,
  blockBoundary: /[;\{\}]/,
  propertyBoundary: /^[;:]/,
  propertyDelimiter: /^[;\}]/,
  quotation: /['"]/
};

let tokenType = {
  none: 0,
  whitespace: 1,
  boundary: 2,
  string: 3,
  word: 4
};

let whitespaceGreedy = /(\s+)/g;

function traverseWhitespace(source, offset) {
  var match;

  whitespaceGreedy.lastIndex = offset;
  match = whitespaceGreedy.exec(source);

  if (match == null || match.index !== offset) {
    return offset;
  }

  return whitespaceGreedy.lastIndex;
}

export { matcher, tokenType, traverseWhitespace };
