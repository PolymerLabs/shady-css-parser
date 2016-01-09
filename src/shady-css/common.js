/**
 * A set of common RegExp matchers for tokenizing CSS.
 * @constant
 * @type {object}
 * @default
 */
const matcher = {
  whitespace: /\s/,
  whitespaceGreedy: /(\s+)/g,
  commentGreedy: /(\*\/)/g,
  boundary: /[\(\)\{\}'"@;\s]/,
  stringBoundary: /['"]/
};

/**
 * An enumeration of Node types.
 * @constant
 * @type {object}
 * @default
 */
const nodeType = {
  stylesheet: 1,
  comment: 2,
  atRule: 3,
  selector: 4,
  expression: 5,
  declaration: 6,
  ruleset: 7,
  discarded: 8
};

export { matcher, nodeType };
