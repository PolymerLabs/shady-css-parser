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