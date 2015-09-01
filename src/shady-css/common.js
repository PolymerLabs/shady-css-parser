let matcher = {
  whitespace: /\s/,
  whitespaceGreedy: /(\s+)/g,
  commentOpen: /^\/\*/,
  commentClose: /\*\/$/,
  boundary: /[\(\)\{\}\[\]'"@;:\s\.#+>~\^]|\/\*/,
  // TODO: "Block boundary" is a bad name for this character set:
  blockBoundary: /[;\{\}]/,
  combinatorBoundary: /[\{]/,
  propertyBoundary: /^[;:]/,
  // TODO: This also delimits atRules
  propertyDelimiter: /^[;\}]/,
  propertyNameTrail: /:$/,
  stringBoundary: /['"]/
};

let tokenType = {
  none: 0,
  whitespace: 1,
  boundary: 2,
  stringBoundary: 3,
  string: 4,
  word: 5
};

let nodeType = {
  unknown: 0,
  stylesheet: 1,
  comment: 2,
  atRule: 3,
  selector: 4,
  value: 5,
  property: 6,
  block: 7,
  parserError: 8
};

export { matcher, tokenType, nodeType };
