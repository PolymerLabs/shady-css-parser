/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { nodeType } from './common';

/**
 * Class used for generating nodes in a CSS AST. Extend this class to implement
 * visitors to different nodes while the tree is being generated, and / or
 * custom node generation.
 */
class NodeFactory {
  /**
   * Creates a Stylesheet node.
   * @param {array} rules The list of rules that appear at the top
   * level of the stylesheet.
   * @return {object} A Stylesheet node.
   */
  stylesheet(rules) {
    // console.log(JSON.stringify(rules, null, 2));
    return { type: nodeType.stylesheet, rules };
  }

  /**
   * Creates an At Rule node.
   * @param {string} name The "name" of the At Rule (e.g., `charset`)
   * @param {string} parameters The "parameters" of the At Rule (e.g., `utf8`)
   * @param {object=} rulelist The Rulelist node (if any) of the At Rule.
   * @return {object} An At Rule node.
   */
  atRule(name, parameters, rulelist) {
    return { type: nodeType.atRule, name, parameters, rulelist };
  }

  /**
   * Creates a Comment node.
   * @param {string} value The full text content of the comment, including
   * opening and closing comment signature.
   * @return {object} A Comment node.
   */
  comment(value) {
    return { type: nodeType.comment, value };
  }

  /**
   * Creates a Rulelist node.
   * @param {array} rules An array of the Rule nodes found within the Ruleset.
   * @return {object} A Rulelist node.
   */
  rulelist(rules) {
    return { type: nodeType.rulelist, rules };
  }

  /**
   * Creates a Ruleset node.
   * @param {string} selector The selector that corresponds to the Selector
   * (e.g., `#foo > .bar`).
   * @param {object} rulelist The Rulelist node that corresponds to the Selector.
   * @return {object} A Selector node.
   */
  ruleset(selector, rulelist) {
    return { type: nodeType.ruleset, selector, rulelist };
  }

  /**
   * Creates a Declaration node.
   * @param {string} name The property name of the Declaration (e.g., `color`).
   * @param {object} value Either an Expression node, or a Rulelist node, that
   * corresponds to the value of the Declaration.
   * @return {object} A Declaration node.
   */
  declaration(name, value) {
    return { type: nodeType.declaration, name, value };
  }

  /**
   * Creates an Expression Terms node.
   * @param {Array} terms An ordered list of terms and operators in the
   * expression.
   * @return {object} An Expression node.
   */
  expression(terms) {
    return { type: nodeType.expression, terms };
  }

  /**
   * Creates a Term node.
   * @param {string} value The value of the expression (e.g., `block`)
   * @return {object} An Expression node.
   */
  term(value) {
    return { type: nodeType.term, value };
  }

  /**
   * Creates a Function node.
   * @param {string} name The name of the function.
   * @param {object} terms The Expression Terms node that represents the
   * function arguments.
   * @return {object} A Function node.
   */
  function(name, terms) {
    return { type: nodeType.function, name, terms };
  }

  /**
   * Creates an Operator node.
   * @param {string} symbol The symbol of the operator.
   * @return {object} An Operator node.
   */
  operator(symbol) {
    return { type: nodeType.operator, symbol };
  }

  /**
   * Creates a Discarded node. Discarded nodes contain content that was not
   * parseable (usually due to typos, or otherwise unrecognized syntax).
   * @param {string} text The text content that is discarded.
   * @return {object} A Discarded node.
   */
  discarded(text) {
    return { type: nodeType.discarded, text };
  }
}

export { NodeFactory };
