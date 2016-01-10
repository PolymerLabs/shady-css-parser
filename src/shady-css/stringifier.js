import { nodeType } from './common';
import { NodeVisitor } from './node-visitor';

class Stringifier extends NodeVisitor {
  stringify(ast) {
    return this.visit(ast) || '';
  }

  [nodeType.stylesheet](stylesheet) {
    let rules = '';

    for (let i = 0; i < stylesheet.rules.length; ++i) {
      rules += this.visit(stylesheet.rules[i]);
    }

    return rules;
  }

  [nodeType.atRule](atRule) {
    return `@${atRule.name}` +
      (atRule.parameters ? ` ${atRule.parameters}` : '') +
      (atRule.ruleset ? `${this.visit(atRule.ruleset)}` : ';');
  }

  [nodeType.ruleset](ruleset) {
    let rules = '{';

    for (let i = 0; i < ruleset.rules.length; ++i) {
      rules += this.visit(ruleset.rules[i]);
    }

    return rules + '}';
  }

  [nodeType.comment](comment) {
    return `${comment.value}`;
  }

  [nodeType.selector](selector) {
    return `${selector.combinator}${this.visit(selector.ruleset)}`;
  }

  [nodeType.declaration](declaration) {
    return `${declaration.name}:${this.visit(declaration.value)};`;
  }

  [nodeType.expression](expression) {
    return `${expression.text}`;
  }

  [nodeType.discarded](discarded) {
    return '';
  }
}

export { Stringifier };
