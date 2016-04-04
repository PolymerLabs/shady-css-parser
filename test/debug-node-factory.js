import { NodeFactory } from '../src/shady-css/node-factory';
import { nodeType } from '../src/shady-css/common';

class DebugNodeFactory extends NodeFactory {}

Object.getOwnPropertyNames(NodeFactory.prototype).forEach((property) => {
  DebugNodeFactory.prototype[property] = function(...args) {
    let rule = NodeFactory.prototype[property].call(this, ...args);
    rule.type = rule.type + ' (' + property + ')';
    return rule;
  };
});

export { DebugNodeFactory };
