(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.token = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Token = function () {
    function Token(type, start, end) {
      _classCallCheck(this, Token);

      this.type = type;
      this.start = start;
      this.end = end;
    }

    Token.prototype.is = function is(type) {
      return (this.type & type) === type;
    };

    return Token;
  }();

  Token.type = {
    whitespace: 1,
    string: 2,
    comment: 4,
    word: 8,
    boundary: 16,
    propertyBoundary: 32,
    openParenthesis: 64 | 16,
    closeParenthesis: 128 | 16,
    at: 256 | 16,
    openBrace: 512 | 16,
    closeBrace: 1024 | 32 | 16,
    semicolon: 2048 | 32 | 16
  };
  var boundaryTokenTypes = {
    '(': Token.type.openParenthesis,
    ')': Token.type.closeParenthesis,
    ':': Token.type.colon,
    '@': Token.type.at,
    '{': Token.type.openBrace,
    '}': Token.type.closeBrace,
    ';': Token.type.semicolon,
    '-': Token.type.hyphen,
    '_': Token.type.underscore
  };
  exports.Token = Token;
  exports.boundaryTokenTypes = boundaryTokenTypes;
});