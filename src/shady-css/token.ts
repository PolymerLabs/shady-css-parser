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

/**
 * An enumeration of Token types.
 */
export const enum TokenType {
  none = 0,
  whitespace = (1 << 0),
  string = (1 << 1),
  comment = (1 << 2),
  word = (1 << 3),
  boundary = (1 << 4),
  propertyBoundary = (1 << 5),
  // Special cases for boundary:
  openParenthesis = (1 << 6) | TokenType.boundary,
  closeParenthesis = (1 << 7) | TokenType.boundary,
  at = (1 << 8) | TokenType.boundary,
  openBrace = (1 << 9) | TokenType.boundary,
  // [};] are property boundaries:
  closeBrace = (1 << 10) | TokenType.propertyBoundary | TokenType.boundary,
  semicolon = (1 << 11) | TokenType.propertyBoundary | TokenType.boundary,
  // : is a chimaeric abomination:
  // foo:bar{}
  // foo:bar;
  colon = (1 << 12) | TokenType.boundary | TokenType.word,

  // TODO: are these two boundaries? I mean, sometimes they are I guess? Or
  //       maybe they shouldn't exist in the boundaryTokenTypes map.
  hyphen = (1 << 13),
  underscore = (1 << 14)
}


/**
 * Class that describes individual tokens as produced by the Tokenizer.
 */
class Token {
  readonly type: TokenType;
  readonly start: number;
  readonly end: number;
  previous: Token|null;
  next: Token|null;

  /**
   * Create a Token instance.
   * @param type The lexical type of the Token.
   * @param start The start index of the text corresponding to the
   * Token in the CSS text.
   * @param end The end index of the text corresponding to the Token
   * in the CSS text.
   */
  constructor(type: TokenType, start: number, end: number) {
    this.type = type;
    this.start = start;
    this.end = end;
    this.previous = null;
    this.next = null;
  }

  /**
   * Test if the Token matches a given numeric type. Types match if the bitwise
   * AND of the Token's type and the argument type are equivalent to the
   * argument type.
   * @param type The numeric type to test for equivalency with the
   * Token.
   */
  is(type: TokenType) {
    return (this.type & type) === type;
  }
}

/**
 * A mapping of boundary token text to their corresponding types.
 */
const boundaryTokenTypes: {[boundaryText: string]: TokenType | undefined} = {
  '(': TokenType.openParenthesis,
  ')': TokenType.closeParenthesis,
  ':': TokenType.colon,
  '@': TokenType.at,
  '{': TokenType.openBrace,
  '}': TokenType.closeBrace,
  ';': TokenType.semicolon,
  '-': TokenType.hyphen,
  '_': TokenType.underscore
};

export {Token, boundaryTokenTypes};
