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

import {Token, TokenType} from '../shady-css/token';
import {Tokenizer} from '../shady-css/tokenizer';

import * as fixtures from './fixtures';
import * as helpers from './helpers';

describe('Tokenizer', () => {
  describe('when tokenizing basic structures', () => {
    it('can identify strings', () => {
      expect(new Tokenizer('"foo"').flush()).to.be.eql(helpers.linkedTokens([
        new Token(TokenType.string, 0, 5)
      ]));
    });

    it('can identify comments', () => {
      expect(new Tokenizer('/*foo*/').flush()).to.be.eql(helpers.linkedTokens([
        new Token(TokenType.comment, 0, 7)
      ]));
    });

    it('can identify words', () => {
      expect(new Tokenizer('font-family').flush())
          .to.be.eql(helpers.linkedTokens([new Token(TokenType.word, 0, 11)]));
    });

    it('can identify boundaries', () => {
      expect(new Tokenizer('@{};()').flush()).to.be.eql(helpers.linkedTokens([
        new Token(TokenType.at, 0, 1),
        new Token(TokenType.openBrace, 1, 2),
        new Token(TokenType.closeBrace, 2, 3),
        new Token(TokenType.semicolon, 3, 4),
        new Token(TokenType.openParenthesis, 4, 5),
        new Token(TokenType.closeParenthesis, 5, 6)
      ]));
    });
  });

  describe('when tokenizing standard CSS structures', () => {
    it('can tokenize a basic ruleset', () => {
      helpers.expectTokenSequence(new Tokenizer(fixtures.basicRuleset), [
        TokenType.whitespace, '\n',   TokenType.word,       'body',
        TokenType.whitespace, ' ',    TokenType.openBrace,  '{',
        TokenType.whitespace, '\n  ', TokenType.word,       'margin',
        TokenType.colon,      ':',    TokenType.whitespace, ' ',
        TokenType.word,       '0',    TokenType.semicolon,  ';',
        TokenType.whitespace, '\n  ', TokenType.word,       'padding',
        TokenType.colon,      ':',    TokenType.whitespace, ' ',
        TokenType.word,       '0px',  TokenType.whitespace, '\n',
        TokenType.closeBrace, '}',    TokenType.whitespace, '\n'
      ]);
    });

    it('can tokenize @rules', () => {
      helpers.expectTokenSequence(new Tokenizer(fixtures.atRules), [
        TokenType.whitespace,
        '\n',
        TokenType.at,
        '@',
        TokenType.word,
        'import',
        TokenType.whitespace,
        ' ',
        TokenType.word,
        'url',
        TokenType.openParenthesis,
        '(',
        TokenType.string,
        '\'foo.css\'',
        TokenType.closeParenthesis,
        ')',
        TokenType.semicolon,
        ';',
        TokenType.whitespace,
        '\n\n',
        TokenType.at,
        '@',
        TokenType.word,
        'font-face',
        TokenType.whitespace,
        ' ',
        TokenType.openBrace,
        '{',
        TokenType.whitespace,
        '\n  ',
        TokenType.word,
        'font-family',
        TokenType.colon,
        ':',
        TokenType.whitespace,
        ' ',
        TokenType.word,
        'foo',
        TokenType.semicolon,
        ';',
        TokenType.whitespace,
        '\n',
        TokenType.closeBrace,
        '}',
        TokenType.whitespace,
        '\n\n',
        TokenType.at,
        '@',
        TokenType.word,
        'charset',
        TokenType.whitespace,
        ' ',
        TokenType.string,
        '\'foo\'',
        TokenType.semicolon,
        ';',
        TokenType.whitespace,
        '\n'
      ]);
    });

    it('navigates pathological boundary usage', () => {
      helpers.expectTokenSequence(new Tokenizer(fixtures.extraSemicolons), [
        TokenType.whitespace, '\n',      TokenType.colon,      ':',
        TokenType.word,       'host',    TokenType.whitespace, ' ',
        TokenType.openBrace,  '{',       TokenType.whitespace, '\n  ',
        TokenType.word,       'margin',  TokenType.colon,      ':',
        TokenType.whitespace, ' ',       TokenType.word,       '0',
        TokenType.semicolon,  ';',       TokenType.semicolon,  ';',
        TokenType.semicolon,  ';',       TokenType.whitespace, '\n  ',
        TokenType.word,       'padding', TokenType.colon,      ':',
        TokenType.whitespace, ' ',       TokenType.word,       '0',
        TokenType.semicolon,  ';',       TokenType.semicolon,  ';',
        TokenType.whitespace, '\n  ',    TokenType.semicolon,  ';',
        TokenType.word,       'display', TokenType.colon,      ':',
        TokenType.whitespace, ' ',       TokenType.word,       'block',
        TokenType.semicolon,  ';',       TokenType.whitespace, '\n',
        TokenType.closeBrace, '}',       TokenType.semicolon,  ';',
        TokenType.whitespace, '\n'
      ]);
    });
  });

  describe('when extracting substrings', () => {
    it('can slice the string using tokens', () => {
      const tokenizer = new Tokenizer('foo bar');
      const substring = tokenizer.slice(
          new Token(TokenType.word, 2, 3), new Token(TokenType.word, 5, 6));
      expect(substring).to.be.eql('o ba');
    });
  });
});
