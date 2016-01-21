(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.common = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var matcher = {
    whitespace: /\s/,
    whitespaceGreedy: /(\s+)/g,
    commentGreedy: /(\*\/)/g,
    boundary: /[\(\)\{\}'"@;\s]/,
    stringBoundary: /['"]/
  };
  var nodeType = {
    stylesheet: 1,
    comment: 2,
    atRule: 3,
    ruleset: 4,
    expression: 5,
    declaration: 6,
    rulelist: 7,
    discarded: 8
  };
  exports.matcher = matcher;
  exports.nodeType = nodeType;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './common'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./common'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.common);
    global.nodeFactory = mod.exports;
  }
})(this, function (exports, _common) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NodeFactory = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NodeFactory = function () {
    function NodeFactory() {
      _classCallCheck(this, NodeFactory);
    }

    NodeFactory.prototype.stylesheet = function stylesheet(rules) {
      return {
        type: _common.nodeType.stylesheet,
        rules: rules
      };
    };

    NodeFactory.prototype.atRule = function atRule(name, parameters, rulelist) {
      return {
        type: _common.nodeType.atRule,
        name: name,
        parameters: parameters,
        rulelist: rulelist
      };
    };

    NodeFactory.prototype.comment = function comment(value) {
      return {
        type: _common.nodeType.comment,
        value: value
      };
    };

    NodeFactory.prototype.rulelist = function rulelist(rules) {
      return {
        type: _common.nodeType.rulelist,
        rules: rules
      };
    };

    NodeFactory.prototype.ruleset = function ruleset(selector, rulelist) {
      return {
        type: _common.nodeType.ruleset,
        selector: selector,
        rulelist: rulelist
      };
    };

    NodeFactory.prototype.declaration = function declaration(name, value) {
      return {
        type: _common.nodeType.declaration,
        name: name,
        value: value
      };
    };

    NodeFactory.prototype.expression = function expression(text) {
      return {
        type: _common.nodeType.expression,
        text: text
      };
    };

    NodeFactory.prototype.discarded = function discarded(text) {
      return {
        type: _common.nodeType.discarded,
        text: text
      };
    };

    return NodeFactory;
  }();

  exports.NodeFactory = NodeFactory;
});
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
    global.nodeVisitor = mod.exports;
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

  var path = Symbol('path');

  var NodeVisitor = function () {
    function NodeVisitor() {
      _classCallCheck(this, NodeVisitor);

      this[path] = [];
    }

    NodeVisitor.prototype.visit = function visit(node) {
      var result = undefined;

      if (this[node.type]) {
        this[path].push(node);
        result = this[node.type](node);
        this[path].pop();
      }

      return result;
    };

    _createClass(NodeVisitor, [{
      key: 'path',
      get: function () {
        return this[path];
      }
    }]);

    return NodeVisitor;
  }();

  exports.NodeVisitor = NodeVisitor;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './common', './node-visitor'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./common'), require('./node-visitor'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.common, global.nodeVisitor);
    global.stringifier = mod.exports;
  }
})(this, function (exports, _common, _nodeVisitor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Stringifier = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Stringifier = function (_NodeVisitor) {
    _inherits(Stringifier, _NodeVisitor);

    function Stringifier() {
      _classCallCheck(this, Stringifier);

      return _possibleConstructorReturn(this, _NodeVisitor.apply(this, arguments));
    }

    Stringifier.prototype.stringify = function stringify(ast) {
      return this.visit(ast) || '';
    };

    Stringifier.prototype[_common.nodeType.stylesheet] = function (stylesheet) {
      var rules = '';

      for (var i = 0; i < stylesheet.rules.length; ++i) {
        rules += this.visit(stylesheet.rules[i]);
      }

      return rules;
    };

    Stringifier.prototype[_common.nodeType.atRule] = function (atRule) {
      return '@' + atRule.name + (atRule.parameters ? ' ' + atRule.parameters : '') + (atRule.rulelist ? '' + this.visit(atRule.rulelist) : ';');
    };

    Stringifier.prototype[_common.nodeType.rulelist] = function (rulelist) {
      var rules = '{';

      for (var i = 0; i < rulelist.rules.length; ++i) {
        rules += this.visit(rulelist.rules[i]);
      }

      return rules + '}';
    };

    Stringifier.prototype[_common.nodeType.comment] = function (comment) {
      return '' + comment.value;
    };

    Stringifier.prototype[_common.nodeType.ruleset] = function (ruleset) {
      return '' + ruleset.selector + this.visit(ruleset.rulelist);
    };

    Stringifier.prototype[_common.nodeType.declaration] = function (declaration) {
      return declaration.name + ':' + this.visit(declaration.value) + ';';
    };

    Stringifier.prototype[_common.nodeType.expression] = function (expression) {
      return '' + expression.text;
    };

    Stringifier.prototype[_common.nodeType.discarded] = function (discarded) {
      return '';
    };

    return Stringifier;
  }(_nodeVisitor.NodeVisitor);

  exports.Stringifier = Stringifier;
});
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
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './tokenizer', './token', './node-factory'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./tokenizer'), require('./token'), require('./node-factory'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tokenizer, global.token, global.nodeFactory);
    global.parser = mod.exports;
  }
})(this, function (exports, _tokenizer, _token, _nodeFactory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Parser = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Parser = function () {
    function Parser() {
      var nodeFactory = arguments.length <= 0 || arguments[0] === undefined ? new _nodeFactory.NodeFactory() : arguments[0];

      _classCallCheck(this, Parser);

      this.nodeFactory = nodeFactory;
    }

    Parser.prototype.parse = function parse(cssText) {
      return this.parseStylesheet(new _tokenizer.Tokenizer(cssText));
    };

    Parser.prototype.parseStylesheet = function parseStylesheet(tokenizer) {
      return this.nodeFactory.stylesheet(this.parseRules(tokenizer));
    };

    Parser.prototype.parseRules = function parseRules(tokenizer) {
      var rules = [];

      while (tokenizer.currentToken) {
        var rule = this.parseRule(tokenizer);

        if (rule) {
          rules.push(rule);
        }
      }

      return rules;
    };

    Parser.prototype.parseRule = function parseRule(tokenizer) {
      if (tokenizer.currentToken.is(_token.Token.type.whitespace)) {
        tokenizer.advance();
        return null;
      } else if (tokenizer.currentToken.is(_token.Token.type.comment)) {
        return this.parseComment(tokenizer);
      } else if (tokenizer.currentToken.is(_token.Token.type.propertyBoundary)) {
        return this.parseUnknown(tokenizer);
      } else if (tokenizer.currentToken.is(_token.Token.type.word)) {
        return this.parseDeclarationOrRuleset(tokenizer);
      } else if (tokenizer.currentToken.is(_token.Token.type.at)) {
        return this.parseAtRule(tokenizer);
      } else {
        return this.parseUnknown(tokenizer);
      }
    };

    Parser.prototype.parseComment = function parseComment(tokenizer) {
      return this.nodeFactory.comment(tokenizer.slice(tokenizer.advance()));
    };

    Parser.prototype.parseUnknown = function parseUnknown(tokenizer) {
      var start = tokenizer.advance();
      var end = undefined;

      while (tokenizer.currentToken) {
        if (tokenizer.currentToken.is(_token.Token.type.boundary) && !tokenizer.currentToken.is(_token.Token.type.semicolon)) {
          break;
        }

        end = tokenizer.advance();
      }

      return this.nodeFactory.discarded(tokenizer.slice(start, end));
    };

    Parser.prototype.parseAtRule = function parseAtRule(tokenizer) {
      var name = '';
      var rulelist = null;
      var parametersStart = null;
      var parametersEnd = null;

      while (tokenizer.currentToken) {
        if (tokenizer.currentToken.is(_token.Token.type.whitespace)) {
          tokenizer.advance();
        } else if (!name && tokenizer.currentToken.is(_token.Token.type.at)) {
          tokenizer.advance();
          var start = tokenizer.currentToken;
          var end = undefined;

          while (tokenizer.currentToken && tokenizer.currentToken.is(_token.Token.type.word)) {
            end = tokenizer.advance();
          }

          name = tokenizer.slice(start, end);
        } else if (tokenizer.currentToken.is(_token.Token.type.openBrace)) {
          rulelist = this.parseRulelist(tokenizer);
          break;
        } else if (tokenizer.currentToken.is(_token.Token.type.propertyBoundary)) {
          tokenizer.advance();
          break;
        } else {
          if (parametersStart == null) {
            parametersStart = tokenizer.advance();
          } else {
            parametersEnd = tokenizer.advance();
          }
        }
      }

      return this.nodeFactory.atRule(name, parametersStart ? tokenizer.slice(parametersStart, parametersEnd) : '', rulelist);
    };

    Parser.prototype.parseRulelist = function parseRulelist(tokenizer) {
      var rules = [];
      tokenizer.advance();

      while (tokenizer.currentToken) {
        if (tokenizer.currentToken.is(_token.Token.type.closeBrace)) {
          tokenizer.advance();
          break;
        } else {
          var rule = this.parseRule(tokenizer);

          if (rule) {
            rules.push(rule);
          }
        }
      }

      return this.nodeFactory.rulelist(rules);
    };

    Parser.prototype.parseDeclarationOrRuleset = function parseDeclarationOrRuleset(tokenizer) {
      var rule = '';
      var ruleStart = null;
      var ruleEnd = null;

      while (tokenizer.currentToken) {
        if (tokenizer.currentToken.is(_token.Token.type.whitespace)) {
          tokenizer.advance();
        } else if (tokenizer.currentToken.is(_token.Token.type.openParenthesis)) {
          while (tokenizer.currentToken && !tokenizer.currentToken.is(_token.Token.type.closeParenthesis)) {
            tokenizer.advance();
          }
        } else if (tokenizer.currentToken.is(_token.Token.type.openBrace) || tokenizer.currentToken.is(_token.Token.type.propertyBoundary)) {
          break;
        } else {
          if (!ruleStart) {
            ruleStart = tokenizer.advance();
          } else {
            ruleEnd = tokenizer.advance();
          }
        }
      }

      rule = tokenizer.slice(ruleStart, ruleEnd);

      if (tokenizer.currentToken.is(_token.Token.type.propertyBoundary)) {
        var colonIndex = rule.indexOf(':');
        var value = rule.substr(colonIndex + 1).trim();

        if (tokenizer.currentToken.is(_token.Token.type.semicolon)) {
          tokenizer.advance();
        }

        return this.nodeFactory.declaration(rule.substr(0, colonIndex), this.nodeFactory.expression(value));
      } else if (rule[rule.length - 1] === ':') {
        var rulelist = this.parseRulelist(tokenizer);

        if (tokenizer.currentToken.is(_token.Token.type.semicolon)) {
          tokenizer.advance();
        }

        return this.nodeFactory.declaration(rule.substr(0, rule.length - 1), rulelist);
      } else {
        return this.nodeFactory.ruleset(rule.trim(), this.parseRulelist(tokenizer));
      }
    };

    return Parser;
  }();

  exports.Parser = Parser;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './shady-css/common', './shady-css/token', './shady-css/tokenizer', './shady-css/node-factory', './shady-css/node-visitor', './shady-css/stringifier', './shady-css/parser'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./shady-css/common'), require('./shady-css/token'), require('./shady-css/tokenizer'), require('./shady-css/node-factory'), require('./shady-css/node-visitor'), require('./shady-css/stringifier'), require('./shady-css/parser'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.common, global.token, global.tokenizer, global.nodeFactory, global.nodeVisitor, global.stringifier, global.parser);
    global.shadyCss = mod.exports;
  }
})(this, function (exports, _common, _token, _tokenizer, _nodeFactory, _nodeVisitor, _stringifier, _parser) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'nodeType', {
    enumerable: true,
    get: function () {
      return _common.nodeType;
    }
  });
  Object.defineProperty(exports, 'Token', {
    enumerable: true,
    get: function () {
      return _token.Token;
    }
  });
  Object.defineProperty(exports, 'Tokenizer', {
    enumerable: true,
    get: function () {
      return _tokenizer.Tokenizer;
    }
  });
  Object.defineProperty(exports, 'NodeFactory', {
    enumerable: true,
    get: function () {
      return _nodeFactory.NodeFactory;
    }
  });
  Object.defineProperty(exports, 'NodeVisitor', {
    enumerable: true,
    get: function () {
      return _nodeVisitor.NodeVisitor;
    }
  });
  Object.defineProperty(exports, 'Stringifier', {
    enumerable: true,
    get: function () {
      return _stringifier.Stringifier;
    }
  });
  Object.defineProperty(exports, 'Parser', {
    enumerable: true,
    get: function () {
      return _parser.Parser;
    }
  });
});