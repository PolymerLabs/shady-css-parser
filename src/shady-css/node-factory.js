import { nodeType } from './common';

class NodeFactory {
  atRule(name, parameters, block) {
    return {
      type: nodeType.atRule,
      name,
      parameters,
      block,
      toString() {
        return `@${this.name} ${this.parameters}` +
          (this.block ? ` ${this.block}` : '') + ';';
      }
    };
  }

  comment(value) {
    return {
      type: nodeType.comment,
      value,
      toString() {
        return `${this.value}`;
      }
    };
  }

  block(declarations) {
    return {
      type: nodeType.block,
      declarations,
      toString() {
        return `{
${this.declarations ? this.declarations.join('\n') : ''}
}`;
      }
    };
  }

  selector(combinator, block) {
    return {
      type: nodeType.selector,
      combinator,
      block,
      toString() {
        return `${this.combinator} ${this.block}`;
      }
    };
  }

  property(name, value) {
    return {
      type: nodeType.property,
      name,
      value,
      toString() {
        if (!this.name || !this.value) debugger;
        return `${this.name}: ${this.value};`
      }
    };
  }

  propertyValue(text) {
    return {
      type: nodeType.value,
      text,
      toString() {
        return `${this.text}`;
      }
    };
  }

  parserError(index, ...artifacts) {
    return {
      type: nodeType.parserError,
      index,
      artifacts,
      toString() {
        return '';
      }
    };
  }

  stylesheet(declarations) {
    return {
      type: nodeType.stylesheet,
      declarations,
      toString() {
        return this.declarations.join('\n');
      }
    };
  }
}

export { NodeFactory };
