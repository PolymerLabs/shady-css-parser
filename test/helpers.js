import { expect } from 'chai';

function expectTokenType(token, type) {
  expect(token).to.be.ok;
  expect(token.type).to.be.equal(type);
}

function expectTokenTypeOrder(lexer, types) {
  let lexedTypes = [];
  let _types = types.slice();
  let token;

  while (token = lexer.advance()) {
    lexedTypes.push(token.type);
  }

  expect(lexedTypes).to.be.eql(types);
}

export { expectTokenType, expectTokenTypeOrder };
