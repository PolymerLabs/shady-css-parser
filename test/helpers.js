/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

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
