const path = Symbol('path');

class NodeVisitor {
  constructor() {
    this[path] = [];
  }

  get path() {
    return this[path];
  }

  visit(node) {
    let result;
    if (this[node.type]) {
      this[path].push(node);
      result = this[node.type](node);
      this[path].pop();
    }
    return result;
  }
}

export { NodeVisitor };
