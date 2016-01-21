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