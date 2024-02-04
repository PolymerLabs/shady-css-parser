/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {expect} from 'chai';

import {nodeType} from '../shady-css/common';
import {NodeVisitor} from '../shady-css/node-visitor';

type TestNode = TestNodeA | TestNodeB;
interface TestNodeA {
  type: nodeType.stylesheet;
  callback?: () => void;
}

interface TestNodeB {
  type: nodeType.rulelist;
  child?: TestNode;
}

class TestNodeVisitor extends NodeVisitor<TestNode, string> {
  aCallCount: number;
  bCallCount: number;

  constructor() {
    super();

    this.aCallCount = 0;
    this.bCallCount = 0;
  }

  stylesheet(a: TestNodeA) {
    this.aCallCount++;
    if (a.callback) {
      a.callback();
    }
    return 'stylesheet';
  }

  rulelist(b: TestNodeB) {
    this.bCallCount++;
    if (b.child) {
      this.visit(b.child);
    }
    return 'rulelist';
  }
}

describe('NodeVisitor', () => {
  let nodeVisitor: TestNodeVisitor;

  beforeEach(function () {
    nodeVisitor = new TestNodeVisitor();
  });

  it('visits nodes based on their type property', () => {
    nodeVisitor.visit({type: nodeType.stylesheet});
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    expect(nodeVisitor.bCallCount).to.be.eql(0);
    nodeVisitor.visit({type: nodeType.rulelist});
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    expect(nodeVisitor.bCallCount).to.be.eql(1);
  });

  it('reveals the path of the recursive visitation of nodes', () => {
    const a1 = {
      type: nodeType.stylesheet as const,
      callback: function () {
        expect(nodeVisitor.path).to.be.eql([a1]);
      },
    };
    const a2: TestNodeA = {
      type: nodeType.stylesheet as const,
      callback: function () {
        expect(nodeVisitor.path).to.be.eql([b, a2]);
      },
    };
    const b = {type: nodeType.rulelist as const, child: a2};

    nodeVisitor.visit(a1);
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    nodeVisitor.visit(b);
    expect(nodeVisitor.aCallCount).to.be.eql(2);
    expect(nodeVisitor.bCallCount).to.be.eql(1);
  });
});
