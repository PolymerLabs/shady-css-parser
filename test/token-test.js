import { expect } from 'chai';
import { Token } from '../src/shady-css/token';

describe('Token', () => {
  it('supports bitfield type comparison', () => {
    let token = new Token(128 | 32 | 2);
    expect(token.is(2)).to.be.ok;
    expect(token.is(4)).to.not.be.ok;
    expect(token.is(32 | 2)).to.be.ok;
    expect(token.is(4 | 64)).to.not.be.ok;
    expect(token.is(128)).to.be.ok;
  });
});
