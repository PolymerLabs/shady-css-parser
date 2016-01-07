let expect = require('chai').expect;
let helpers = require('./helpers');
let fixtures = require('./fixtures');
let TokenCursor = require('../src/shady-css/token-cursor').TokenCursor;
let Tokenizer = require('../src/shady-css/tokenizer').Tokenizer;
let common = require('../src/shady-css/common');
let tokenType = common.tokenType;

describe('TokenCursor', () => {
  describe('when parsing css', () => {
    let tokenCursor;

    beforeEach(() => {
      tokenCursor = new TokenCursor(new Tokenizer(fixtures.basicSelector));
    });

    it('tracks the token index', () => {
      expect(tokenCursor.index).to.be.equal(0);

      tokenCursor.takeOne();

      expect(tokenCursor.index).to.be.equal(1);

      tokenCursor.takeOne();
      tokenCursor.takeOne();

      expect(tokenCursor.index).to.be.equal(3);
    });

    it('only increments the token index when taking tokens', () => {
      tokenCursor.takeOne();
      expect(tokenCursor.index).to.be.equal(1);
      tokenCursor.next;
      expect(tokenCursor.index).to.be.equal(1);
      tokenCursor.takeOne();
      expect(tokenCursor.index).to.be.equal(2);
    });

    it('lets you peek at the next token', () => {
      expect(tokenCursor.next).to.be.ok;
      expect(tokenCursor.next.type).to.be.equal(tokenType.whitespace);
      expect(tokenCursor.next).to.be.eql(tokenCursor.next);
    });

    it('lets you take tokens from the set', () => {
      let takenToken = tokenCursor.takeOne();

      expect(takenToken).to.be.ok;
      expect(takenToken.type).to.be.equal(tokenType.whitespace);

      expect(takenToken).to.not.eql(tokenCursor.next);
    });

    it('enables iteration over all tokens', () => {
      let tokenCount = 0;
      let token;

      while (token = tokenCursor.takeOne()) {
        expect(token).to.be.ok;
        expect(tokenCount++).to.be.lessThan(18);
      }

      expect(tokenCount).to.be.equal(18);
      expect(tokenCursor.index).to.be.equal(18);
    });

    it('enables iteration over some tokens', () => {
      let tokenCount = 4;
      let token;

      for (let i = 0; i < tokenCount; ++i) {
        tokenCursor.takeOne();
      }

      while (token = tokenCursor.takeOne()) {
        if (++tokenCount === 10) {
          break;
        }
      }

      expect(tokenCursor.index).to.be.equal(10);
    });
  });
});
