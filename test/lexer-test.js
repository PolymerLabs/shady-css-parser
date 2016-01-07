let Tokenizer = require('../src/shady-css/tokenizer').Tokenizer;
let common = require('../src/shady-css/common');
let helpers = require('./helpers');
let fixtures = require('./fixtures');
let tokenType = common.tokenType;

describe('tokenizer', () => {
  describe('when tokenizing standard CSS structures', () => {
    it('can tokenize a basic selector', () => {
      helpers.expectTokenTypeOrder(new Tokenizer(fixtures.basicSelector), [
        tokenType.whitespace, // '\n'
        tokenType.word,       // 'body'
        tokenType.whitespace, // ' '
        tokenType.boundary,   // '{'
        tokenType.whitespace, // '\n'
        tokenType.word,       // 'margin'
        tokenType.boundary,   // ':'
        tokenType.whitespace, // ' '
        tokenType.word,       // '0'
        tokenType.boundary,   // ';'
        tokenType.whitespace, // '\n'
        tokenType.word,       // 'padding'
        tokenType.boundary,   // ':'
        tokenType.whitespace, // ' '
        tokenType.word,       // '0px'
        tokenType.whitespace, // '\n'
        tokenType.boundary,   // '}'
        tokenType.whitespace  // '\n'
      ]);
    });

    it('can tokenize @rules', () => {
      helpers.expectTokenTypeOrder(new Tokenizer(fixtures.atRules), [
        tokenType.whitespace, // '\n'
        tokenType.boundary,   // '@'
        tokenType.word,       // 'import'
        tokenType.whitespace, // ' '
        tokenType.word,       // 'url'
        tokenType.boundary,   // '('
        tokenType.string,     // '\'foo.css\''
        tokenType.boundary,   // ')'
        tokenType.boundary,   // ';'
        tokenType.whitespace, // '\n\n',
        tokenType.boundary,   // '@',
        tokenType.word,       // 'font-face'
        tokenType.whitespace, // ' '
        tokenType.boundary,   // '{'
        tokenType.whitespace, // '\n  ',
        tokenType.word,       // 'font-family'
        tokenType.boundary,   // ':'
        tokenType.whitespace, // ' '
        tokenType.word,       // 'foo'
        tokenType.boundary,   // ';'
        tokenType.whitespace, // '\n'
        tokenType.boundary,   // '}'
        tokenType.whitespace, // '\n\n'
        tokenType.boundary,   // '@'
        tokenType.word,       // 'word'
        tokenType.whitespace, // ' '
        tokenType.string,     // '\'foo\''
        tokenType.boundary,   // ';'
        tokenType.whitespace, // '\n'
      ]);
    });
  });
});
