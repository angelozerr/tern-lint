(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("../lib/infer"), require("../lib/tern"), require("acorn/util/walk"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["../lib/infer", "../lib/tern", "acorn/util/walk"], mod);
  mod(tern, tern, acorn.walk);
})(function(infer, tern, walk) {
  "use strict";

  function outputPos(query, file, pos) {
    if (query.lineCharPositions) {
      var out = file.asLineChar(pos);
      return out;
    } else {
      return pos;
    }
  }

  function makeVisitors(query, file, messages) {
    function makeError(node, msg) {
      var pos = getPosition(node);
      return {
          message: msg,
          from: outputPos(query, file, pos.start),
          to: outputPos(query, file, pos.end),
          severity : 'warning'
      };
    }

    function getName(node) {
      if(node.callee) {
        return getName(node.callee);
      }
      if(node.property) {
        return node.property.name;
      } else {
        return node.name;
      }
    }

    function getPosition(node) {
      if(node.callee) {
        return getPosition(node.callee);
      }
      if(node.property) {
        return node.property;
      }
      return node;
    }

    function getScope(node) {
      // This could be a performance hog (not sure)
      return infer.scopeAt(file.ast, node, file.scope);
    }

    var visitors = {
      MemberExpression: function(node, state, c) {
        var memberExpr = {node: node, state: getScope(node)};
        var type = infer.expressionType(memberExpr);
        if(type.isEmpty()) {
          var error = makeError(node, "Unknown property '" + getName(node) + "'");
          messages.push(error);
        }
      },
      Identifier: function(node, state, c) {
        var expr = {node: node, state: getScope(node)};
        var type = infer.expressionType(expr);

        if(type.isEmpty()) {
          var error = makeError(node, "Unknown identifier '" + getName(node) + "'");
          messages.push(error);
        }
      },
      CallExpression: function(node, state, c) {
        var memberExpr = {node: node.callee, state: getScope(node)};

        var type = infer.expressionType(memberExpr);
        if(!type.isEmpty()) {
          // If type.isEmpty(), it is handled by MemberExpression/Identifier already.
          var fnType = type.getFunctionType();
          if(fnType == null) {
            var error = makeError(node, "'" + getName(node) + "' is not a function");
            error.severity = "error";
            messages.push(error);
          }
        }
      }
    };

    return visitors;
  }


  var base = walk.base;

  tern.defineQueryType("lint", {
    takesFile: true,
    run: function(server, query, file) {
      try {
        var messages = [];
        var ast = file.ast;
        var visitors = makeVisitors(query, file, messages);

        var state = file.scope;

        walk.simple(ast, visitors, base, state);

        return {messages: messages};
      } catch(err) {
        console.error(err.stack);
        return {messages: []};
      }
    }
  });
  
});  