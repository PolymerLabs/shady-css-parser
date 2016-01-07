/**
 * A set of common RegExp matchers for tokenizing CSS.
 * @constant
 * @type {object}
 * @default
 */
const matcher = {
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

/**
 * An enumeration of Token types.
 * @constant
 * @type {object}
 * @default
 */
const tokenType = {
  none: 0,
  whitespace: 1,
  boundary: 2,
  stringBoundary: 3,
  string: 4,
  word: 5
};

/**
 * An enumeration of Node types.
 * @constant
 * @type {object}
 * @default
 */
const nodeType = {
  unknown: 0,
  stylesheet: 1,
  comment: 2,
  atRule: 3,
  selector: 4,
  value: 5,
  property: 6,
  block: 7,
  discarded: 8
};

export { matcher, tokenType, nodeType };
