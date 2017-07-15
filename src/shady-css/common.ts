/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

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
  boundary: /[\(\)\{\}'"@;:\s]/,
  stringBoundary: /['"]/
};

/**
 * An enumeration of Node types.
 * @constant
 * @type {object}
 * @default
 */
enum nodeType {
  stylesheet= 'stylesheet',
  comment= 'comment',
  atRule= 'atRule',
  ruleset= 'ruleset',
  expression= 'expression',
  declaration= 'declaration',
  rulelist= 'rulelist',
  discarded= 'discarded'
};

export type Node = Stylesheet | AtRule | Comment | Rulelist | Ruleset | Expression | Declaration | Discarded;
export type Rule = Ruleset | Declaration | AtRule | Discarded | Comment;
export interface Stylesheet {
  type: nodeType.stylesheet,
  rules: Rule[]
}

export interface AtRule {
  type: nodeType.atRule;
  name: string;
  parameters: string;
  rulelist: Rulelist|undefined;
}

export interface Comment {
  type: nodeType.comment;
  value: string;
}

export interface Rulelist {
  type: nodeType.rulelist;
  rules: Rule[];
}

export interface Ruleset {
  type: nodeType.ruleset;
  rulelist: Rulelist;
  selector: string;
}

export interface Expression {
  type: nodeType.expression;
  text: string;
}

export interface Declaration {
  type: nodeType.declaration
  name: string;
  value: Rulelist | Expression;
}

export interface Discarded {
  type: nodeType.discarded;
  text: string;
}

export { matcher, nodeType };
