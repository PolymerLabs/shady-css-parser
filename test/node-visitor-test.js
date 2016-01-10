import { expect } from 'chai';
import { NodeVisitor } from '../src/shady-css/node-visitor';

class TestNodeVisitor extends NodeVisitor {
  constructor() {
    super();

    this.aCallCount = 0;
    this.bCallCount = 0;
  }

  a(a) {
    this.aCallCount++;
    if (a.callback) {
      a.callback();
    }
    return 'a';
  }

  b(b) {
    this.bCallCount++;
    if (b.child) {
      this.visit(b.child);
    }
    return 'b';
  }
}

describe('NodeVisitor', () => {
  let nodeVisitor;

  beforeEach(function() {
    nodeVisitor = new TestNodeVisitor();
  });

  it('visits nodes based on their type property', () => {
    nodeVisitor.visit({
      type: 'a'
    });
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    expect(nodeVisitor.bCallCount).to.be.eql(0);
    nodeVisitor.visit({
      type: 'b'
    });
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    expect(nodeVisitor.bCallCount).to.be.eql(1);
  });

  it('reveals the path of the recursive visitation of nodes', () => {
    let a1 = {
      type: 'a',
      callback: function() {
        expect(nodeVisitor.path).to.be.eql([a1]);
      }
    };
    let a2 = {
      type: 'a',
      callback: function() {
        expect(nodeVisitor.path).to.be.eql([b, a2]);
      }
    };
    let b =  {
      type: 'b',
      child: a2
    };

    nodeVisitor.visit(a1);
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    nodeVisitor.visit(b);
    expect(nodeVisitor.aCallCount).to.be.eql(2);
    expect(nodeVisitor.bCallCount).to.be.eql(1);
  });
});
