/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {AtRule, Comment, Declaration, Discarded, Expression, nodeType, Range, Rule, Rulelist, Ruleset, Stylesheet} from './common';

/**
 * Class used for generating nodes in a CSS AST. Extend this class to implement
 * visitors to different nodes while the tree is being generated, and / or
 * custom node generation.
 */
class NodeFactory {
  /**
   * Creates a Stylesheet node.
   * @param rules The list of rules that appear at the top
   * level of the stylesheet.
   */
  stylesheet(rules: Rule[]): Stylesheet {
    return { type: nodeType.stylesheet, rules };
  }

  /**
   * Creates an At Rule node.
   * @param name The "name" of the At Rule (e.g., `charset`)
   * @param parameters The "parameters" of the At Rule (e.g., `utf8`)
   * @param rulelist The Rulelist node (if any) of the At Rule.
   */
  atRule(name: string, parameters: string, rulelist: Rulelist|
        undefined=undefined): AtRule {
    return { type: nodeType.atRule, name, parameters, rulelist };
  }

  /**
   * Creates a Comment node.
   * @param value The full text content of the comment, including
   * opening and closing comment signature.
   */
  comment(value: string): Comment {
    return { type: nodeType.comment, value };
  }

  /**
   * Creates a Rulelist node.
   * @param rules An array of the Rule nodes found within the Ruleset.
   */
  rulelist(rules: Rule[]): Rulelist {
    return { type: nodeType.rulelist, rules };
  }

  /**
   * Creates a Ruleset node.
   * @param selector The selector that corresponds to the Selector
   * (e.g., `#foo > .bar`).
   * @param rulelist The Rulelist node that corresponds to the Selector.
   */
  ruleset(selector: string, rulelist: Rulelist): Ruleset {
    return { type: nodeType.ruleset, selector, rulelist };
  }

  /**
   * Creates a Declaration node.
   * @param name The property name of the Declaration (e.g., `color`).
   * @param value Either an Expression node, or a Rulelist node, that
   * corresponds to the value of the Declaration.
   */
  declaration(name: string, value: Expression|Rulelist|undefined): Declaration {
    return { type: nodeType.declaration, name, value };
  }

  /**
   * Creates an Expression node.
   * @param text The full text content of the expression (e.g.,
   * `url(img.jpg)`)
   */
  expression(text: string, range: Range): Expression {
    return { type: nodeType.expression, text, range };
  }

  /**
   * Creates a Discarded node. Discarded nodes contain content that was not
   * parseable (usually due to typos, or otherwise unrecognized syntax).
   * @param text The text content that is discarded.
   */
  discarded(text: string, range: Range): Discarded {
    return { type: nodeType.discarded, text, range};
  }
}

export { NodeFactory };
