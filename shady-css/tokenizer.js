(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './common', './token'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./common'), require('./token'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.common, global.token);
    global.tokenizer = mod.exports;
  }
})(this, function (exports, _common, _token) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Tokenizer = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var currentToken = Symbol('currentToken');
  var nextToken = Symbol('nextToken');

  var Tokenizer = function () {
    function Tokenizer(cssText) {
      _classCallCheck(this, Tokenizer);

      this.cssText = cssText;
      this.offset = 0;
      this[currentToken] = null;
    }

    Tokenizer.prototype.advance = function advance() {
      var token = undefined;

      if (this[currentToken] != null) {
        token = this[currentToken];
        this[currentToken] = null;
      } else {
        token = this[nextToken]();
      }

      return token;
    };

    Tokenizer.prototype.slice = function slice(startToken, endToken) {
      endToken = endToken || startToken;
      return this.cssText.substring(startToken.start, endToken.end);
    };

    Tokenizer.prototype.flush = function flush() {
      var tokens = [];

      while (this.currentToken) {
        tokens.push(this.advance());
      }

      return tokens;
    };

    Tokenizer.prototype[nextToken] = function () {
      var character = this.cssText[this.offset];
      var token = undefined;
      this[currentToken] = null;

      if (this.offset >= this.cssText.length) {
        return null;
      } else if (_common.matcher.whitespace.test(character)) {
        token = this.tokenizeWhitespace(this.offset);
      } else if (_common.matcher.stringBoundary.test(character)) {
        token = this.tokenizeString(this.offset);
      } else if (character === '/' && this.cssText[this.offset + 1] === '*') {
        token = this.tokenizeComment(this.offset);
      } else if (_common.matcher.boundary.test(character)) {
        token = this.tokenizeBoundary(this.offset);
      } else {
        token = this.tokenizeWord(this.offset);
      }

      this.offset = token.end;
      return token;
    };

    Tokenizer.prototype.tokenizeString = function tokenizeString(offset) {
      var quotation = this.cssText[offset];
      var escaped = false;
      var start = offset;
      var character = undefined;

      while (character = this.cssText[++offset]) {
        if (escaped) {
          escaped = false;
          continue;
        }

        if (character === quotation) {
          ++offset;
          break;
        }

        if (character === '\\') {
          escaped = true;
        }
      }

      return new _token.Token(_token.Token.type.string, start, offset);
    };

    Tokenizer.prototype.tokenizeWord = function tokenizeWord(offset) {
      var start = offset;
      var character = undefined;

      while ((character = this.cssText[offset]) && !_common.matcher.boundary.test(character)) {
        offset++;
      }

      return new _token.Token(_token.Token.type.word, start, offset);
    };

    Tokenizer.prototype.tokenizeWhitespace = function tokenizeWhitespace(offset) {
      var start = offset;
      _common.matcher.whitespaceGreedy.lastIndex = offset;

      var match = _common.matcher.whitespaceGreedy.exec(this.cssText);

      if (match != null && match.index === offset) {
        offset = _common.matcher.whitespaceGreedy.lastIndex;
      }

      return new _token.Token(_token.Token.type.whitespace, start, offset);
    };

    Tokenizer.prototype.tokenizeComment = function tokenizeComment(offset) {
      var start = offset;
      _common.matcher.commentGreedy.lastIndex = offset;

      var match = _common.matcher.commentGreedy.exec(this.cssText);

      if (match == null) {
        offset = this.cssText.length;
      } else {
        offset = _common.matcher.commentGreedy.lastIndex;
      }

      return new _token.Token(_token.Token.type.comment, start, offset);
    };

    Tokenizer.prototype.tokenizeBoundary = function tokenizeBoundary(offset) {
      var type = _token.boundaryTokenTypes[this.cssText[offset]] || _token.Token.type.boundary;
      return new _token.Token(type, offset, offset + 1);
    };

    _createClass(Tokenizer, [{
      key: 'currentToken',
      get: function () {
        if (this[currentToken] == null) {
          this[currentToken] = this[nextToken]();
        }

        return this[currentToken];
      }
    }]);

    return Tokenizer;
  }();

  exports.Tokenizer = Tokenizer;
});