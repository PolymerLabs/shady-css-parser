var parser = require('../');
var common = require('../src/shady-css-parser/common');
var fs = require('fs');
var css = fs.readFileSync('./demo/test.css').toString();


var strawman = '  a  b  c';

for (var i = 0; i < strawman.length; ++i) {
  console.log('offset: ' + i + ', ' + common.traverseWhitespace(strawman, i));
}


console.log(parser.lex(css));
console.log(parser.parse(css));
