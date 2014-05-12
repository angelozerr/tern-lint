(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("../lib/infer"), require("../lib/tern"), require("acorn/util/walk"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["../lib/infer", "../lib/tern", "acorn/util/walk"], mod);
  mod(tern, tern, acorn.walk);
})(function(infer, tern, walk) {
  "use strict";
  
  var scopeGatherer = walk.make({
	MemberExpression: function(node, state, c) {
		  var file = state.file, messages = state.messages, query = state.query;
          var memberExpr = {node:node, state:file.scope};
          var tp = infer.expressionType(memberExpr);
          if (node.property.name != "✖" && !(tp && tp.propertyOf && tp.propertyOf.hasProp(node.property.name))) {
            messages.push({message: "Unknown property '" + node.property.name + "'", 
              from: outputPos(query, file, node.property.start),
              to: outputPos(query, file, node.property.end),
              severity : 'warning'});
          }
        }
  	,
  	CallExpression: function(node, state, c) {
  		 var file = state.file, messages = state.messages, query = state.query;
  		 node = node.callee;
         var memberExpr = {node:node, state:file.scope};
         var tp = infer.expressionType(memberExpr);
         if (node.property.name != "✖" && !(tp && tp.propertyOf && tp.propertyOf.hasProp(node.property.name))) {
           messages.push({message: "Unknown property '" + node.property.name + "'", 
             from: outputPos(query, file, node.property.start),
             to: outputPos(query, file, node.property.end),
             severity : 'warning'});
         }
  	}
  });

  tern.defineQueryType("lint", {
    takesFile: true,
    run: function(server, query, file) {
      
      var messages = [];
      var ast = file.ast;
      var state = {messages: messages, file : file, query : query}
      walk.recursive(ast, state, null, scopeGatherer);
      
      return {messages: messages};
    }
  });
  
  function outputPos(query, file, pos) {
    if (query.lineCharPositions) {
      var out = file.asLineChar(pos);
      return out;
      } else {
      return pos;
    }
  }
  
});  