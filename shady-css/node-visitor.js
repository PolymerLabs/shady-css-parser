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