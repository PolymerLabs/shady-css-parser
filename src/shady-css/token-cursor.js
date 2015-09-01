const index = Symbol('index');
const lexer = Symbol('lexer');
const nextToken = Symbol('nextToken');

class TokenCursor {
  constructor(_lexer) {
    this[index] = 0;
    this[lexer] = _lexer;
    this[nextToken] = null;
  }

  get index() {
    return this[index];
  }

  get next() {
    if (this[nextToken] == null) {
      this[nextToken] = this[lexer].nextToken();
    }

    return this[nextToken];
  }

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
