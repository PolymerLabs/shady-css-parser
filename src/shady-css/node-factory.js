import { nodeType } from './common';

/**
 * Class used for generating nodes in a CSS AST. Extend this class to implement
 * visitors to different nodes while the tree is being generated, and / or
 * custom node generation.
 */
class NodeFactory {
  /**
   * Creates a Stylesheet node.
   * @param {array} declarations The list of declarations that appear at the top
   * level of the stylesheet.
   * @return {object} A Stylesheet node.
   */
  stylesheet(declarations) {
    return { type: nodeType.stylesheet, declarations };
  }

  /**
   * Creates an At Rule node.
   * @param {string} name The "name" of the At Rule (e.g., `charset`)
   * @param {string} parameters The "parameters" of the At Rule (e.g., `utf8`)
   * @param {object=} block The Block node (if any) of the At Rule.
   * @return {object} An At Rule node.
   */
  atRule(name, parameters, block) {
    return { type: nodeType.atRule, name, parameters, block };
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
   * Creates a Block node.
   * @param {array} declarations An array of the Declarations found withoin the
   * Block.
   * @return {object} A Block node.
   */
  block(declarations) {
    return { type: nodeType.block, declarations };
  }

  /**
   * Creates a Selector node.
   * @param {string} combinator The combinator that corresponds to the Selector
   * (e.g., `#foo > .bar`).
   * @param {object} block The Block node that corresponds to the Selector.
   * @return {object} A Selector node.
   */
  selector(combinator, block) {
    return { type: nodeType.selector, combinator, block };
  }

  /**
   * Creates a Property node.
   * @param {string} name The name of the Property (e.g., `color`).
   * @param {object} value Either a Property Value node, or a Block node, that
   * corresponds to the value of the property.
   * @return {object} A Property node.
   */
  property(name, value) {
    return { type: nodeType.property, name, value };
  }

  /**
   * Creates a Property Value node.
   * @param {string} text The full text content of the property value (e.g.,
   * `url(img.jpg)`)
   * @return {object} A Property Value node.
   */
  propertyValue(text) {
    return { type: nodeType.value, text };
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
