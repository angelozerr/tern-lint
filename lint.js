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
	
    function addMessage(node, msg, severity) {
      var error = makeError(node, msg, severity);
      messages.push(error);		
    }
	
    function makeError(node, msg, severity) {
      var pos = getPosition(node);
      return {
          message: msg,
          from: outputPos(query, file, pos.start),
          to: outputPos(query, file, pos.end),
          severity : severity
      };
    }

    function getNodeName(node) {
      if(node.callee) {
        // This is a CallExpression node.
        // We get the position of the function name.
        return getNodeName(node.callee);
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
    
    function getTypeName(type) {
      if (!type) return "Unknown type";
      return type.proto.name;
    }

    function compareType(expectedType, actualType) {
      if (!expectedType) return true;
      if (!actualType) return true;
      var currentProto = actualType.proto;
      while(currentProto) {
        if (expectedType.proto.name === currentProto.name) return true;
        currentProto = currentProto.proto;
      }
      return false;
    }
    
    function validateCallExpression(node, state, c) {
      var notAFunctionRule = getRule("NotAFunction"), invalidArgument = getRule("InvalidArgument");
      if (!notAFunctionRule && !invalidArgument) return;        
      var type = infer.expressionType({node: node.callee, state: state});
      if(!type.isEmpty()) {
        // If type.isEmpty(), it is handled by MemberExpression/Identifier already.

        // An expression can have multiple possible (guessed) types.
        // If one of them is a function, type.getFunctionType() will return it.
        var fnType = type.getFunctionType();
        if(fnType == null) {
          if (notAFunctionRule) addMessage(node, "'" + getNodeName(node) + "' is not a function", notAFunctionRule.severity);                           
        } else if (fnType.lint) {
           // custom lint for function
          fnType.lint(node, addMessage);
        } else if (fnType.args) {
          // validate parameters of the function 
          if (!invalidArgument) return;
          var actualArgs = node.arguments;
          if (!actualArgs) return;//addMessage(c, "'" + getNodeName(c) + "' no args", invalidArgument.severity);
          var expectedArgs = fnType.args;
          for (var i = 0; i < expectedArgs.length; i++) {
            var expectedArg = expectedArgs[i];
            if (actualArgs.length > i) {
              var actualNode = actualArgs[i];
              var actualArg = infer.expressionType({node: actualNode, state: state});
              if (!compareType(expectedArg.getType(), actualArg.getType())) {
                // Type check an object literal in a parameter, see tests labelled #JSObjectLiteralInParameter
                // often an object literal is used to express bunch of optional arguments to a function
                // this has a low overhead because Object Literals (typed as a function argument) rarely have more than 20 properties
                if (actualNode.type === "ObjectExpression") {
                  var prop_count = 0;
                  for (var prop in actualArg.props) {
                    // test that each object literal prop exists in expectedArg.proto.props
                    if (! ( prop in expectedArg.proto.props ) ) {
                      addMessage(actualNode.properties[prop_count].key, "Invalid argument at " + (i+1) + ": " + prop + " is not a property in " + getTypeName(expectedArg.getType()), invalidArgument.severity);
                    } else {
                      // test that each object literal prop is the correct type
                      if (getTypeName(expectedArg.proto.props[prop].getType()) !== getTypeName(actualArg.props[prop].getType())) {
                        addMessage(actualNode.properties[prop_count].value, "Invalid argument at " + (i+1) + ": cannot convert from " + getTypeName(actualArg.props[prop].getType()) + " to " + getTypeName(expectedArg.proto.props[prop].getType()), invalidArgument.severity);
                      }
                    }
                    prop_count++;
                  }
                /* TODO: handle the case where the identifier points to an object literal
                } else if (actualNode.type === "Identifier") {
                  findDef()
                */
                } else
                  addMessage(actualNode, "Invalid argument at " + (i+1) + ": cannot convert from " + getTypeName(actualArg.getType()) + " to " + getTypeName(expectedArg.getType()), invalidArgument.severity);
              }
            }              
          }
        }
      }
    }
    
    var visitors = {
      // Detects expressions of the form `object.property`
      MemberExpression: function(node, state, c) {
        var rule = getRule("UnknownProperty");
        if (!rule) return;
        var type = infer.expressionType({node: node, state: state});
        var parentType = infer.expressionType({node: node.object, state: state});

        if(node.computed) {
          // Bracket notation.
          // Until we figure out how to handle these properly, we ignore these nodes.
          return;
        }
        
        if(!parentType.isEmpty() && type.isEmpty()) {
          // The type of the property cannot be determined, which means
          // that the property probably doesn't exist.

          // We only do this check if the parent type is known,
          // otherwise we will generate errors for an entire chain of unknown
          // properties.

          // Also, the expression may be valid even if the parent type is unknown,
          // since the inference engine cannot detect the type in all cases.

          var propertyDefined = false;

          // In some cases the type is unknown, even if the property is defined
          if(parentType.types) {
            // We cannot use parentType.hasProp or parentType.props - in the case of an AVal,
            // this may contain properties that are not really defined.
            parentType.types.forEach(function(potentialType) {
              // Obj#hasProp checks the prototype as well
              if(typeof potentialType.hasProp == 'function' && potentialType.hasProp(node.property.name, true)) {
                propertyDefined = true;
              }
            });
          }

          if(!propertyDefined) {
            addMessage(node, "Unknown property '" + getNodeName(node) + "'", rule.severity);
          }
        }
      },
      // Detects top-level identifiers, e.g. the object in
      // `object.property` or just `object`.
      Identifier: function(node, state, c) {
        var rule = getRule("UnknownIdentifier");
        if (!rule) return;
        var type = infer.expressionType({node: node, state: state});

        if(type.originNode != null) {
          // The node is defined somewhere (could be this node),
          // regardless of whether or not the type is known.
        } else if(type.isEmpty()) {
          // The type of the identifier cannot be determined,
          // and the origin is unknown.
          addMessage(node, "Unknown identifier '" + getNodeName(node) + "'", rule.severity);        	
        } else {
          // Even though the origin node is unknown, the type is known.
          // This is typically the case for built-in identifiers (e.g. window or document).
        }
      },
      // Detects function calls.
      // `node.callee` is the expression (Identifier or MemberExpression)
      // the is called as a function.
      NewExpression: validateCallExpression,
      CallExpression: validateCallExpression
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
        var messages = [], ast = file.ast, state = file.scope;
        var visitors = makeVisitors(query, file, messages);
        walk.simple(ast, visitors, base, state);
        return {messages: messages};
      } catch(err) {
        console.error(err.stack);
        return {messages: []};
      }
    }
  });

  var lints = Object.create(null);
  tern.registerLint = function(defName, path, prop, lint) { 
	var lintsForDef = lints[defName];
	if (!lintsForDef) {lintsForDef = []; lints[defName] = lintsForDef;} 
	lintsForDef.push({path: path, prop: prop, lint: lint});
  };
  
  var defaultRules = {
    "UnknownProperty" : {"severity" : "warning"},
    "UnknownIdentifier" : {"severity" : "warning"},
    "NotAFunction" : {"severity" : "error"},
    "InvalidArgument" : {"severity" : "error"}
  }
  
  tern.registerPlugin("lint", function(server, options) {	
    server._lint = {
      rules: getRules(options)	
    };
    return {
    	passes: {postLoadDef: postLoadDef}
    };
  });
  
  function getRules(options) {
    var rules = {};
    for(var ruleName in defaultRules) {
      if (options && options.rules && options.rules[ruleName] && options.rules[ruleName].severity) {
    	rules[ruleName] =  options.rules[ruleName];
      }	else {
      	rules[ruleName] = defaultRules[ruleName];
      }
    }
    return rules;
  }
  
  function getRule(ruleName) {
    var cx = infer.cx(), server = cx.parent, rules = server._lint.rules;
    return rules[ruleName];
  }
  
  function postLoadDef(json) {
    var cx = infer.cx(), defName = json["!name"], lintsForDef = lints[defName];
    if (cx.paths && lintsForDef) {
      for (var i = 0; i < lintsForDef.length; i++) {
        var dataLint = lintsForDef[i];
        var proto = cx.paths[dataLint.path], type = null;
        if (proto) {
          type = proto.getProp(dataLint.prop).getType();
        } else {
          var o = cx.props[dataLint.path];
          if (o) {
            type = o[0].props[dataLint.prop].getType();
          }
        } 
        if (type) type.lint = dataLint.lint;				
	  }          
    }
  }
  
  // Hack to manage lint for node, requirejs which are hosted in tern github
  tern.registerLint("node", "require", "require", function(node, addMessage) {
	  var cx = infer.cx(), server = cx.parent, data = server._node;
	  var argNodes = node.arguments;
	  if (argNodes && argNodes.length && argNodes[0].type == "Literal" || typeof argNodes[0].value == "string") {
	    var name = argNodes[0].value, module = cx.definitions.node[name];
	    if (!module) {
      	  addMessage(argNodes[0], "Unknown module '" + name + "'", 'warning');
        }
	  }
  });
  
});  