import { expect } from 'chai';
import * as fixtures from './fixtures';
import { DebugNodeFactory } from './debug-node-factory';
import { Parser } from '../src/shady-css/parser';
import { nodeType } from '../src/shady-css/common';

const nodeFactory = new DebugNodeFactory();

describe('parser', () => {
  let parser;

  beforeEach(() => {
    parser = new Parser(nodeFactory);
  });

  describe('when parsing css', () => {
    it('can parse a basic selector', () => {
      expect(parser.parse(fixtures.basicSelector))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('body', nodeFactory.block([
          nodeFactory.property('margin', nodeFactory.propertyValue('0')),
          nodeFactory.property('padding', nodeFactory.propertyValue('0px'))
        ]))
      ]));
    });

    it('can parse at rules', () => {
      expect(parser.parse(fixtures.atRules)).to.be.eql(nodeFactory.stylesheet([
        nodeFactory.atRule('import', 'url(\'foo.css\')'),
        nodeFactory.atRule('font-face', '', nodeFactory.block([
          nodeFactory.property(
            'font-family',
            nodeFactory.propertyValue('foo')
          )
        ])),
        nodeFactory.atRule('charset', '\'foo\'')
      ]));
    });

    it('can parse keyframes', () => {
      expect(parser.parse(fixtures.keyframes))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.atRule('keyframes', 'foo', nodeFactory.block([
          nodeFactory.selector('from', nodeFactory.block([
            nodeFactory.property('fiz', nodeFactory.propertyValue('0%'))
          ])),
          nodeFactory.selector('99.9%', nodeFactory.block([
            nodeFactory.property('fiz', nodeFactory.propertyValue('100px')),
            nodeFactory.property('buz', nodeFactory.propertyValue('true'))
          ]))
        ]))
      ]));
    });

    it('can parse custom properties', () => {
      expect(parser.parse(fixtures.customProperties))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector(':root', nodeFactory.block([
          nodeFactory.property('--qux', nodeFactory.propertyValue('vim')),
          nodeFactory.property('--foo', nodeFactory.block([
             nodeFactory.property('bar', nodeFactory.propertyValue('baz'))
          ]))
        ]))
      ]))
    });

    it('can parsed minifie rulesets', () => {
      expect(parser.parse(fixtures.minifiedRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('.foo', nodeFactory.block([
          nodeFactory.property('bar', nodeFactory.propertyValue('baz'))
        ])),
        nodeFactory.selector('div .qux', nodeFactory.block([
          nodeFactory.property('vim', nodeFactory.propertyValue('fet'))
        ]))
      ]));
    });

    it('can parse psuedo selectors', () => {
      expect(parser.parse(fixtures.psuedoRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('.foo:bar:not(#rif)', nodeFactory.block([
          nodeFactory.property('baz', nodeFactory.propertyValue('qux'))
        ]))
      ]));
    });

    it('can parse rulesets with data URIs', () => {
      expect(parser.parse(fixtures.dataUriRuleset))
          .to.be.eql(nodeFactory.stylesheet([
        nodeFactory.selector('.foo', nodeFactory.block([
          nodeFactory.property('bar', nodeFactory.propertyValue('url(qux;gib)'))
        ]))
      ]));
    });
  });
});
