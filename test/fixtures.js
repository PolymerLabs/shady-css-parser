// CSS test fixtures:
let basicSelector = `
body {
  margin: 0;
  padding: 0px
}
`;

let atRules = `
@import url('foo.css');

@font-face {
  font-family: foo;
}

@charset 'foo';
`;

let keyframes = `
@keyframes foo {
  from {
    fiz: 0%;
  }

  99.9% {
    fiz: 100px;
    buz: true;
  }
}
`;

let customProperties = `
:root {
  --qux: vim;
  --foo: {
    bar: baz;
  };
}
`;

let minifiedRuleset = '.foo{bar:baz}div .qux{vim:fet;}';

let psuedoRuleset = '.foo:bar:not(#rif){baz:qux}';

let dataUriRuleset = '.foo{bar:url(qux;gib)}';

export {
  basicSelector,
  atRules,
  keyframes,
  customProperties,
  minifiedRuleset,
  psuedoRuleset,
  dataUriRuleset
};
