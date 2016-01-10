import { nodeType } from './common';
import { NodeVisitor } from './node-visitor';

/**
 * Class that implements basic stringification of an AST produced by the Parser.
 */
class Stringifier extends NodeVisitor {
  /**
   * Stringify an AST such as one produced by a Parser.
   * @param {object} ast A node object representing the root of an AST.
   * @return {string} The stringified CSS corresponding to the AST.
   */
  stringify(ast) {
    return this.visit(ast) || '';
  }

  /**
   * Visit and stringify a Stylesheet node.
   * @param {object} stylesheet A Stylesheet node.
   * @return {string} The stringified CSS of the Stylesheet.
   */
  [nodeType.stylesheet](stylesheet) {
    let rules = '';

    for (let i = 0; i < stylesheet.rules.length; ++i) {
      rules += this.visit(stylesheet.rules[i]);
    }

    return rules;
  }

  /**
   * Visit and stringify an At Rule node.
   * @param {object} atRule An At Rule node.
   * @return {string} The stringified CSS of the At Rule.
   */
  [nodeType.atRule](atRule) {
    return `@${atRule.name}` +
      (atRule.parameters ? ` ${atRule.parameters}` : '') +
      (atRule.ruleset ? `${this.visit(atRule.ruleset)}` : ';');
  }

  /**
   * Visit and stringify a Ruleset node.
   * @param {object} ruleset A Ruleset node.
   * @return {string} The stringified CSS of the Ruleset.
   */
  [nodeType.ruleset](ruleset) {
    let rules = '{';

    for (let i = 0; i < ruleset.rules.length; ++i) {
      rules += this.visit(ruleset.rules[i]);
    }

    return rules + '}';
  }

  /**
   * Visit and stringify a Comment node.
   * @param {object} comment A Comment node.
   * @return {string} The stringified CSS of the Comment.
   */
  [nodeType.comment](comment) {
    return `${comment.value}`;
  }

  /**
   * Visit and stringify a Seletor node.
   * @param {object} selector A Selector node.
   * @return {string} The stringified CSS of the Selector.
   */
  [nodeType.selector](selector) {
    return `${selector.combinator}${this.visit(selector.ruleset)}`;
  }

  /**
   * Visit and stringify a Declaration node.
   * @param {object} declaration A Declaration node.
   * @return {string} The stringified CSS of the Declaration.
   */
  [nodeType.declaration](declaration) {
    return `${declaration.name}:${this.visit(declaration.value)};`;
  }

  /**
   * Visit and stringify an Expression node.
   * @param {object} expression An Expression node.
   * @return {string} The stringified CSS of the Expression.
   */
  [nodeType.expression](expression) {
    return `${expression.text}`;
  }

  /**
   * Visit a discarded node.
   * @param {object} discarded A Discarded node.
   * @return {string} An empty string, since Discarded nodes are discarded.
   */
  [nodeType.discarded](discarded) {
    return '';
  }
}

export { Stringifier };
