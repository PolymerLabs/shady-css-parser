const index = Symbol('index');
const lexer = Symbol('lexer');
const nextToken = Symbol('nextToken');

/**
 * Class that implements peek and take behavior on top of a given Lexer
 * instance.
 */
class TokenCursor {
  /**
   * Create a TokenCursor.
   * @param {Lexer} _lexer A Lexer instance for the TokenCursor to operate on.
   */
  constructor(_lexer) {
    this[index] = 0;
    this[lexer] = _lexer;
    this[nextToken] = null;
  }

  /**
   * Get the index of the next token that will be taken from the Lexer.
   * @return {number} The index of the next token.
   */
  get index() {
    return this[index];
  }

  /**
   * Peek at the next token that will be taken from the Lexer.
   * @return {object} The next token that will be taken from the Lexer.
   */
  get next() {
    if (this[nextToken] == null) {
      this[nextToken] = this[lexer].nextToken();
    }

    return this[nextToken];
  }

  /**
   * Take the next token from the Lexer.
   * @return {object} The next token from the Lexer.
   */
  takeOne() {
    let takenToken = this.next;
    this[nextToken] = null;

    if (takenToken != null) {
      this[index]++;
    }

    return takenToken;
  }
}

export { TokenCursor };
