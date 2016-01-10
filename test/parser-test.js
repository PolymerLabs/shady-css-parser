/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { expect } from 'chai';
import * as fixtures from './fixtures';
import { DebugNodeFactory } from './debug-node-factory';
import { Parser } from '../src/shady-css/parser';
import { nodeType } from '../src/shady-css/common';

const nodeFactory = new DebugNodeFactory();

describe('Parser', () => {
  let parser;

  beforeEach(() => {
    parser = new Parser(nodeFactory);
  });

  describe('when parsing css', () => {
    it('can parse a basic selector', () => {
      expect(parser.parse(fixtures.basicSelector))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('body', nodeFactory.ruleset([
          nodeFactory.declaration('margin', nodeFactory.expression('0')),
          nodeFactory.declaration('padding', nodeFactory.expression('0px'))
        ]))
      ]));
    });

    it('can parse at rules', () => {
      expect(parser.parse(fixtures.atRules)).to.be.eql(nodeFactory.stylesheet([
        nodeFactory.atRule('import', 'url(\'foo.css\')', null),
        nodeFactory.atRule('font-face', '', nodeFactory.ruleset([
          nodeFactory.declaration(
            'font-family',
            nodeFactory.expression('foo')
          )
        ])),
        nodeFactory.atRule('charset', '\'foo\'', null)
      ]));
    });

    it('can parse keyframes', () => {
      expect(parser.parse(fixtures.keyframes))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.atRule('keyframes', 'foo', nodeFactory.ruleset([
          nodeFactory.selector('from', nodeFactory.ruleset([
            nodeFactory.declaration('fiz', nodeFactory.expression('0%'))
          ])),
          nodeFactory.selector('99.9%', nodeFactory.ruleset([
            nodeFactory.declaration('fiz', nodeFactory.expression('100px')),
            nodeFactory.declaration('buz', nodeFactory.expression('true'))
          ]))
        ]))
      ]));
    });

    it('can parse custom properties', () => {
      expect(parser.parse(fixtures.customProperties))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector(':root', nodeFactory.ruleset([
          nodeFactory.declaration('--qux', nodeFactory.expression('vim')),
          nodeFactory.declaration('--foo', nodeFactory.ruleset([
             nodeFactory.declaration('bar', nodeFactory.expression('baz'))
          ]))
        ]))
      ]))
    });

    it('can parse minified rulesets', () => {
      expect(parser.parse(fixtures.minifiedRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('.foo', nodeFactory.ruleset([
          nodeFactory.declaration('bar', nodeFactory.expression('baz'))
        ])),
        nodeFactory.selector('div .qux', nodeFactory.ruleset([
          nodeFactory.declaration('vim', nodeFactory.expression('fet'))
        ]))
      ]));
    });

    it('can parse psuedo selectors', () => {
      expect(parser.parse(fixtures.psuedoRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('.foo:bar:not(#rif)', nodeFactory.ruleset([
          nodeFactory.declaration('baz', nodeFactory.expression('qux'))
        ]))
      ]));
    });

    it('can parse rulesets with data URIs', () => {
      expect(parser.parse(fixtures.dataUriRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('.foo', nodeFactory.ruleset([
          nodeFactory.declaration('bar', nodeFactory.expression('url(qux;gib)'))
        ]))
      ]));
    });

    it('can parse pathological comments', () => {
      expect(parser.parse(fixtures.pathologicalComments))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('.foo', nodeFactory.ruleset([
          nodeFactory.declaration('bar', nodeFactory.expression('/*baz*/vim'))
        ])),
        nodeFactory.comment('/* unclosed\n@fiz {\n  --huk: {\n    /* buz */'),
        nodeFactory.declaration('baz', nodeFactory.expression('lur')),
        nodeFactory.discarded('};\n'),
        nodeFactory.discarded('}\n'),
        nodeFactory.atRule('gak', 'wiz', null)
      ]));
    });
  });
});
