(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("tern/lib/infer"), require("tern/lib/tern"), require("acorn/util/walk"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["tern/lib/infer", "tern/lib/tern", "acorn/util/walk"], mod);
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
        // This is a CallExpression node.
        // We get the position of the function name.
        return getName(node.callee);
      } else if(node.property) {
        // This is a MemberExpression node.
        // We get the name of the property.
        return node.property.name;
      } else {
        return node.name;
      }
    }

    function getPosition(node) {
      if(node.callee) {
        // This is a CallExpression node.
        // We get the position of the function name.
        return getPosition(node.callee);
      }
      if(node.property) {
        // This is a MemberExpression node.
        // We get the position of the property.
        return node.property;
      }
      return node;
    }

    var visitors = {
      // Detects expressions of the form `object.property`
      MemberExpression: function(node, state, c) {
        var type = infer.expressionType({node: node, state: state});
        if(type.isEmpty()) {
          // The type of the property cannot be determined, which means
          // that the property probably doesn't exist.
          var error = makeError(node, "Unknown property '" + getName(node) + "'");
          messages.push(error);
        }
      },
      // Detects top-level identifiers, e.g. the object in
      // `object.property` or just `object`.
      Identifier: function(node, state, c) {
        var type = infer.expressionType({node: node, state: state});

        if(type.originNode != null) {
          // The node is defined somewhere (could be this node),
          // regardless of whether or not the type is known.
        } else if(type.isEmpty()) {
          // The type of the identifier cannot be determined,
          // and the origin is unknown.
          var error = makeError(node, "Unknown identifier '" + getName(node) + "'");
          messages.push(error);
        } else {
          // Even though the origin node is unknown, the type is known.
          // This is typically the case for built-in identifiers (e.g. window or document).
        }
      },
      // Detects function calls.
      // `node.callee` is the expression (Identifier or MemberExpression)
      // the is called as a function.
      CallExpression: function(node, state, c) {
        var type = infer.expressionType({node: node.callee, state: state});
        if(!type.isEmpty()) {
          // If type.isEmpty(), it is handled by MemberExpression/Identifier already.

          // An expression can have multiple possible (guessed) types.
          // If one of them is a function, type.getFunctionType() will return it.
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

  // Adapted from infer.searchVisitor.
  // Record the scope and pass it through in the state.
  // VariableDeclaration in infer.searchVisitor breaks things for us.
  var scopeVisitor = walk.make({
    Function: function(node, _st, c) {
      var scope = node.body.scope;
      if (node.id) c(node.id, scope);
      for (var i = 0; i < node.params.length; ++i)
        c(node.params[i], scope);
      c(node.body, scope, "ScopeBody");
    }
  });

  // Other alternative bases:
  //   walk.base (no scope handling)
  //   infer.searchVisitor
  //   infer.fullVisitor
  var base = scopeVisitor;

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