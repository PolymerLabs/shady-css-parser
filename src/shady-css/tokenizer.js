import { matcher } from './common';
import { Token, boundaryTokenTypes } from './token';

const currentToken = Symbol('currentToken');

class Tokenizer {
  constructor(cssText) {
    this.cssText = cssText;
    this.offset = 0;
    this[currentToken] = null;
  }

  get currentToken() {
    if (this[currentToken] == null) {
      this[currentToken] = this.nextToken();
    }

    return this[currentToken];
  }

  advance() {
    let token;
    if (this[currentToken] != null) {
      token = this[currentToken];
      this[currentToken] = null;
    } else {
      token = this.nextToken();
    }
    return token;
  }

  nextToken() {
    let character = this.cssText[this.offset];
    let token;

    this[currentToken] = null;

    if (this.offset >= this.cssText.length) {
      return null;
    } else if (matcher.whitespace.test(character)) {
      token = this.tokenizeWhitespace(this.offset);
    } else if (matcher.stringBoundary.test(character)) {
      token = this.tokenizeString(this.offset);
    } else if (character === '/' && this.cssText[this.offset + 1] === '*') {
      token = this.tokenizeComment(this.offset);
    } else if (matcher.boundary.test(character)) {
      token = this.tokenizeBoundary(this.offset);
    } else {
      token = this.tokenizeWord(this.offset);
    }

    this.offset = token.offset;

    return token;
  }

  slice(startToken, endToken) {
    endToken = endToken || startToken;
    return this.cssText.substring(startToken.start, endToken.offset);
  }

  flush() {
    let tokens = [];
    while (this.currentToken) {
      tokens.push(this.advance());
    }
    return tokens;
  }

  tokenizeString(offset) {
    let quotation = this.cssText[offset];
    let escaped = false;
    let start = offset;
    let character;

    while (character = this.cssText[++offset]) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === quotation) {
        ++offset;
        break;
      }

      if (character === '\\') {
        escaped = true;
      }
    }

    return new Token(Token.type.string, start, offset);
  }

  tokenizeWord(offset) {
    let start = offset;
    let character;
    // TODO(cdata): change to greedy regex match?
    while ((character = this.cssText[offset]) &&
           !matcher.boundary.test(character)) {
      offset++;
    }

    return new Token(Token.type.word, start, offset);
  }

  tokenizeWhitespace(offset) {
    let start = offset;

    matcher.whitespaceGreedy.lastIndex = offset;
    let match = matcher.whitespaceGreedy.exec(this.cssText);

    if (match != null && match.index === offset) {
      offset = matcher.whitespaceGreedy.lastIndex;
    }

    return new Token(Token.type.whitespace, start, offset);
  }

  tokenizeComment(offset) {
    let start = offset;

    matcher.commentGreedy.lastIndex = offset;
    let match = matcher.commentGreedy.exec(this.cssText);

    if (match == null) {
      offset = this.cssText.length;
    } else {
      offset = matcher.commentGreedy.lastIndex;
    }

    return new Token(Token.type.comment, start, offset);
  }

  tokenizeBoundary(offset) {
    // TODO(cdata): Evaluate if this is faster than a switch statement:
    let type = boundaryTokenTypes[this.cssText[offset]] || Token.type.boundary;

    return new Token(type, offset, offset + 1);
  }
}

export { Tokenizer };
