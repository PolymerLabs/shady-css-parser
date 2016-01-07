import { nodeType } from './common';

class NodeFactory {
  atRule(name, parameters, block) {
    return { type: nodeType.atRule, name, parameters, block };
  }

  comment(value) {
    return { type: nodeType.comment, value };
  }

  block(declarations) {
    return { type: nodeType.block, declarations };
  }

  selector(combinator, block) {
    return { type: nodeType.selector, combinator, block };
  }

  property(name, value) {
    return { type: nodeType.property, name, value };
  }

  propertyValue(text) {
    return { type: nodeType.value, text };
  }

  discarded(text) {
    return { type: nodeType.discarded, text };
  }

  stylesheet(declaractions) {
    return { type: nodeType.stylesheet, declaractions };
  }
}

export { NodeFactory };
