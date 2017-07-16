/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {expect, use} from 'chai';
import * as util from 'util';

import {NodeFactory, nodeType, Parser} from '../shady-css';
import {Node, NodeTypeMap} from '../shady-css/common';

import * as fixtures from './fixtures';

use(require('chai-subset'));

describe('Parser', () => {
  let parser: Parser;
  let nodeFactory: NodeFactory;

  beforeEach(() => {
    parser = new Parser();
    nodeFactory = parser.nodeFactory;
  });

  describe('when parsing css', () => {
    it('can parse a basic ruleset', () => {
      expect(parser.parse(fixtures.basicRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.ruleset('body', nodeFactory.rulelist([
          nodeFactory.declaration('margin', nodeFactory.expression('0')),
          nodeFactory.declaration('padding', nodeFactory.expression('0px'))
        ]))
      ]));
    });

    it('can parse at rules', () => {
      expect(parser.parse(fixtures.atRules)).to.be.eql(nodeFactory.stylesheet([
        nodeFactory.atRule('import', 'url(\'foo.css\')', undefined),
        nodeFactory.atRule('font-face', '', nodeFactory.rulelist([
          nodeFactory.declaration(
            'font-family',
            nodeFactory.expression('foo')
          )
        ])),
        nodeFactory.atRule('charset', '\'foo\'', undefined)
      ]));
    });

    it('can parse keyframes', () => {
      expect(parser.parse(fixtures.keyframes))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.atRule('keyframes', 'foo', nodeFactory.rulelist([
          nodeFactory.ruleset('from', nodeFactory.rulelist([
            nodeFactory.declaration('fiz', nodeFactory.expression('0%'))
          ])),
          nodeFactory.ruleset('99.9%', nodeFactory.rulelist([
            nodeFactory.declaration('fiz', nodeFactory.expression('100px')),
            nodeFactory.declaration('buz', nodeFactory.expression('true'))
          ]))
        ]))
      ]));
    });

    it('can parse custom properties', () => {
      expect(parser.parse(fixtures.customProperties))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.ruleset(':root', nodeFactory.rulelist([
          nodeFactory.declaration('--qux', nodeFactory.expression('vim')),
          nodeFactory.declaration('--foo', nodeFactory.rulelist([
             nodeFactory.declaration('bar', nodeFactory.expression('baz'))
          ]))
        ]))
      ]))
    });

    it('can parse declarations with no value', () => {
      expect(parser.parse(fixtures.declarationsWithNoValue))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.declaration('foo', undefined),
        nodeFactory.declaration('bar 20px', undefined),
        nodeFactory.ruleset('div', nodeFactory.rulelist([
          nodeFactory.declaration('baz', undefined)
        ]))
      ]));
    });

    it('can parse minified rulelists', () => {
      expect(parser.parse(fixtures.minifiedRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.ruleset('.foo', nodeFactory.rulelist([
          nodeFactory.declaration('bar', nodeFactory.expression('baz'))
        ])),
        nodeFactory.ruleset('div .qux', nodeFactory.rulelist([
          nodeFactory.declaration('vim', nodeFactory.expression('fet'))
        ]))
      ]));
    });

    it('can parse psuedo rulesets', () => {
      expect(parser.parse(fixtures.psuedoRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.ruleset('.foo:bar:not(#rif)', nodeFactory.rulelist([
          nodeFactory.declaration('baz', nodeFactory.expression('qux'))
        ]))
      ]));
    });

    it('can parse rulelists with data URIs', () => {
      expect(parser.parse(fixtures.dataUriRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.ruleset('.foo', nodeFactory.rulelist([
          nodeFactory.declaration('bar', nodeFactory.expression('url(qux;gib)'))
        ]))
      ]));
    });

    it('can parse pathological comments', () => {
      expect(parser.parse(fixtures.pathologicalComments))
          .to.containSubset(nodeFactory.stylesheet([
        nodeFactory.ruleset('.foo', nodeFactory.rulelist([
          nodeFactory.declaration('bar', nodeFactory.expression('/*baz*/vim'))
        ])),
        nodeFactory.comment('/* unclosed\n@fiz {\n  --huk: {\n    /* buz */'),
        nodeFactory.declaration('baz', nodeFactory.expression('lur')),
        {type: 'discarded', text: '};'} as any,
        {type: 'discarded', text: '}'},
        nodeFactory.atRule('gak', 'wiz', undefined)
      ]));
    });

    it('disregards extra semi-colons', () => {
      expect(parser.parse(fixtures.extraSemicolons))
          .to.containSubset(nodeFactory.stylesheet([
        nodeFactory.ruleset(':host', nodeFactory.rulelist([
          nodeFactory.declaration('margin', nodeFactory.expression('0')),
          {type: 'discarded', text: ';;'} as any,
          nodeFactory.declaration('padding', nodeFactory.expression('0')),
          {type: 'discarded', text: ';'},
          {type: 'discarded', text: ';'},
          nodeFactory.declaration('display', nodeFactory.expression('block')),
        ])),
        {type: 'discarded', text: ';'} as any
      ]));
    });
  });

  describe('when extracting ranges', () => {
    it('extracts the correct ranges for discarded nodes', () => {
      const ast = parser.parse(fixtures.extraSemicolons);
      const discardedNodes = getNodesOfType(ast, 'discarded');
      const rangeSubStrings = Array.from(discardedNodes).map(d => {
        return fixtures.extraSemicolons.substring(d.range.start, d.range.end);
      });
      expect(rangeSubStrings).to.be.deep.equal([';;', ';', ';', ';']);
    });
  });
});


function *getNodesOfType<K extends keyof NodeTypeMap>(node: Node, type: K): Iterable<NodeTypeMap[K]> {
  for (const n of iterAst(node)) {
    if (n.type === type as any as nodeType) {
      yield n;
    }
  }
}

function *iterAst(node: Node): Iterable<Node> {
  yield node;
  switch (node.type) {
    case nodeType.stylesheet:
      for (const rule of node.rules) {
        yield* iterAst(rule)
      }
      return;
    case nodeType.ruleset:
      return yield* iterAst(node.rulelist);
    case nodeType.rulelist:
      for (const rule of node.rules) {
        yield* iterAst(rule);
      }
      return;
    case nodeType.expression:
    case nodeType.atRule:
    case nodeType.comment:
    case nodeType.declaration:
    case nodeType.discarded:
      return; // no child nodes
    default:
      const never: never = node;
      console.error(`Got a node of unknown type: ${util.inspect(never)}`);
  }
}
