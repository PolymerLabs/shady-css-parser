const index = Symbol('index');
const tokenizer = Symbol('tokenizer');
const nextToken = Symbol('nextToken');

/**
 * Class that implements peek and take behavior on top of a given Tokenizer
 * instance.
 */
class TokenCursor {
  /**
   * Create a TokenCursor.
   * @param {Tokenizer} _tokenizer A Tokenizer instance for the TokenCursor to operate on.
   */
  constructor(_tokenizer) {
    this[index] = 0;
    this[tokenizer] = _tokenizer;
    this[nextToken] = null;
  }

  /**
   * Get the index of the next token that will be taken from the Tokenizer.
   * @return {number} The index of the next token.
   */
  get index() {
    return this[index];
  }

  /**
   * Peek at the next token that will be taken from the Tokenizer.
   * @return {object} The next token that will be taken from the Tokenizer.
   */
  get next() {
    if (this[nextToken] == null) {
      this[nextToken] = this[tokenizer].nextToken();
    }

    return this[nextToken];
  }

  /**
   * Take the next token from the Tokenizer.
   * @return {object} The next token from the Tokenizer.
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
