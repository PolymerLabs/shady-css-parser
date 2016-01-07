import { matcher, tokenType } from './common';

class Tokenizer {
  constructor(cssText) {
    this.cssText = cssText;
    this.offset = 0;
  }

  nextToken() {
    let token = this.tokenAt(this.offset);
    this.offset = token ? token.offset : this.cssText.length;
    return token;
  }

  tokenAt(offset) {
    let token = this.tokenizeWhitespace(offset);

    if (token.type !== tokenType.whitespace) {
      token = this.advance(offset);
    }

    switch (token && token.type) {
      case tokenType.none:
        if (token.offset < this.cssText.length) {
          return this.tokenizeWord(token.offset);
        }

        return null;
      case tokenType.stringBoundary:
        return this.tokenizeString(token.offset - 1);
      default:
        return token;
    }
  }

  advance(offset) {
    let token;

    if (matcher.stringBoundary.test(this.cssText[offset])) {
      return {
        type: tokenType.stringBoundary,
        text: this.cssText[offset],
        offset: offset + 1
      };
    }

    if (matcher.boundary.test(this.cssText[offset])) {
      return {
        type: tokenType.boundary,
        text: this.cssText[offset],
        offset: offset + 1
      };
    }

    return {
      type: tokenType.none,
      offset: offset
    };
  }

  tokenizeWord(offset) {
    var start = offset;
    let character = this.cssText[offset];

    // TODO(cdata): change to greedy regex match?
    while (offset < this.cssText.length && !matcher.boundary.test(character)) {
      character = this.cssText[++offset];
    }

    if (offset > start) {
      return {
        type: tokenType.word,
        text: this.cssText.substr(start, offset - start),
        offset
      };
    }

    return Token(tokenType.none, null, offset);
  }

  tokenizeWhitespace(offset) {
    let start = offset;

    offset = this.traverseWhitespace(offset);

    if (offset > start) {
      return {
        type: tokenType.whitespace,
        text: this.cssText.substr(start, offset - start),
        offset
      };
    }

    return { type: tokenType.none, offset: offset };
  }

  traverseWhitespace(offset) {
    var match;

    matcher.whitespaceGreedy.lastIndex = offset;
    match = matcher.whitespaceGreedy.exec(this.cssText);

    if (match == null || match.index !== offset) {
      return offset;
    }

    return matcher.whitespaceGreedy.lastIndex;
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

        return {
          type: tokenType.string,
          text: this.cssText.substr(start, offset - start),
          offset
        };
      }

      if (character === '\\') {
        escaped = true;
      }
    }

    return { type: tokenType.none, offset: offset };
  }
}

export { Tokenizer };
