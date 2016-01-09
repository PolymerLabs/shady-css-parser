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
    return { type: nodeType.stylesheet, rules };
  }

  /**
   * Creates an At Rule node.
   * @param {string} name The "name" of the At Rule (e.g., `charset`)
   * @param {string} parameters The "parameters" of the At Rule (e.g., `utf8`)
   * @param {object=} ruleset The Ruleset node (if any) of the At Rule.
   * @return {object} An At Rule node.
   */
  atRule(name, parameters, ruleset) {
    return { type: nodeType.atRule, name, parameters, ruleset };
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
   * Creates a Ruleset node.
   * @param {array} rules An array of the Rule nodes found within the Ruleset.
   * @return {object} A Ruleset node.
   */
  ruleset(rules) {
    return { type: nodeType.ruleset, rules };
  }

  /**
   * Creates a Selector node.
   * @param {string} combinator The combinator that corresponds to the Selector
   * (e.g., `#foo > .bar`).
   * @param {object} ruleset The Ruleset node that corresponds to the Selector.
   * @return {object} A Selector node.
   */
  selector(combinator, ruleset) {
    return { type: nodeType.selector, combinator, ruleset };
  }

  /**
   * Creates a Declaration node.
   * @param {string} name The property name of the Declaration (e.g., `color`).
   * @param {object} value Either an Expression node, or a Ruleset node, that
   * corresponds to the value of the Declaration.
   * @return {object} A Declaration node.
   */
  declaration(name, value) {
    return { type: nodeType.declaration, name, value };
  }

  /**
   * Creates an Expression node.
   * @param {string} text The full text content of the expression (e.g.,
   * `url(img.jpg)`)
   * @return {object} An Expression node.
   */
  expression(text) {
    return { type: nodeType.expression, text };
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
