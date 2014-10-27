var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test Known property'] = function() {
	// Known property document.getElementById
	util.assertLint("var elt = document.getElementById('myId');", {
		messages : []
	}, [ "browser" ], IGNORE_UNUSED_VAR);
}

exports['test Unknown property'] = function() {
        
	// Unknown property
	util.assertLint("var elt = document.getElementByIdXXX('myId');", {
		messages : [ {
			"message" : "Unknown property 'getElementByIdXXX'",
			"from" : 19,
			"to" : 36,
			"severity" : "warning"
		} ]
	}, [ "browser" ], IGNORE_UNUSED_VAR);
	// Unknown property as error
	var options = {"rules" : {"UnknownProperty" : {"severity" : "error"}, 
	                          "UnusedVariable" :  {"severity" : "none"}}};
	util.assertLint("var elt = document.getElementByIdXXX('myId');", {
		messages : [ {
			"message" : "Unknown property 'getElementByIdXXX'",
			"from" : 19,
			"to" : 36,
			"severity" : "error"
		} ]
	}, [ "browser" ], options);	
}

exports['test Unknown identifier'] = function() {
	// without 'browser' def, document is not known
	// The check does not continue to getElementById, since
	// the real cause is that document is undefined.
	util.assertLint("var elt = document.getElementById('myId');", {
		messages : [ {
			"message" : "Unknown identifier 'document'",
			"from" : 10,
			"to" : 18,
			"severity" : "warning"
		} ]
	}, null, IGNORE_UNUSED_VAR);
	// Unknown identifier as error
	var options = {"rules" : {"UnknownIdentifier" : {"severity" : "error"},
	                          "UnusedVariable" :  {"severity" : "none"}}};
	util.assertLint("var elt = document.getElementById('myId');", {
		messages : [ {
			"message" : "Unknown identifier 'document'",
			"from" : 10,
			"to" : 18,
			"severity" : "error"
		} ]
	}, null, options);	
}

exports['test issue1'] = function() {
	// Known property for this. See issue
	// https://github.com/angelozerr/tern.lint/issues/1
	util.assertLint("var a = [];\nvar len = a.length();", {
		messages : [ {
			"message" : "'length' is not a function",
			"from" : 24,
			"to" : 30,
			"severity" : "error"
		} ]
	}, [ "ecma5" ], IGNORE_UNUSED_VAR);
	// Not a function as warning
	var options = {"rules" : {"NotAFunction" : {"severity" : "warning"},
	                          "UnusedVariable" :  {"severity" : "none"}}};	
	util.assertLint("var a = [];\nvar len = a.length();", {
		messages : [ {
			"message" : "'length' is not a function",
			"from" : 24,
			"to" : 30,
			"severity" : "warning"
		} ]
	}, [ "ecma5" ], options);	
	// without ecma5, var 'a' is not an array.
	util.assertLint("var a = [];\nvar len = a.length();", {
		messages : [ {
			"message" : "Unknown property 'length'",
			"from" : 24,
			"to" : 30,
			"severity" : "warning"
		} ]
	}, null, IGNORE_UNUSED_VAR);
}

exports['test issue2'] = function() {
	// Known property for this. See issue
	// https://github.com/angelozerr/tern.lint/issues/2
	util
			.assertLint(
					"function CTor() { this.size = 10; }\nCTor.prototype.hallo = 'hallo';",
					{
						messages : []
					});
}

exports['test variables inside functions'] = function() {
	util.assertLint("function test() { var a = {len: 5}; var len = a.len; }\nfunction b() { }", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);

	util.assertLint("function b() { }\nfunction test() { var d = 5; var a = {len: 5}; var len = a.len; }", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);
}


exports['test functions parameters'] = function() {
	// In this case the type of `a` is inferred as a string
	util.assertLint("function test(a) { var t = a; }; test('something');", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);

	// In this case the type is unknown, but the variable is defined
	// (should not produce a warning)
	util.assertLint("function test(a) { var t = a; };", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);
}


exports['test properties on functions parameters'] = function() {
	// In this case the type of `a` is inferred as an object with a property `len`.
	util.assertLint("function test(a) { var len = a.len; }; test({len: 5});", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);

	// In this case the type of `a` is unknown, and should not produce warnings
	// on any of its properties.
	util.assertLint("function test(a) { var len = a.len; };", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);

	// The same goes for function calls on an unknown type
	util.assertLint("function test(a) { var len = a.myLength(); };", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);
}

exports['test assignment of unknown value'] = function() {

	util.assertLint("var a = {}; function test(p) { var b = a.b; };", {
		messages : [ {
			"message": "Unknown property 'b'",
			"from": 41,
			"to": 42,
			"severity": "warning"} ]
	}, null, IGNORE_UNUSED_VAR);

	// The type of a.t is unknown, but it is still a valid property.
	util.assertLint("var a = {}; function test(p) { a.t = p; var b = a.t; }", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);

	util.assertLint("var a = {}; function test(p) { a.t = p; }", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);

	// This should only contain a warning for `notdefined`, not for b = a.val.
	util.assertLint("function A() {}; A.prototype.val = notdefined; var a = new A(); var b = a.val;", {
		messages : [ {
			"message": "Unknown identifier 'notdefined'",
			"from": 35,
			"to": 45,
			"severity": "warning"} ]
	}, null, IGNORE_UNUSED_VAR);

	util.assertLint("var a = {t: 5}; function test(p) { a.t = p; }", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);
}

exports['test dynamic properties (bracket notation)'] = function() {
	util.assertLint("var obj = { test: 1 }; var key = 'test'; var val1 = obj[key]; var val2 = obj['test'];", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);

	util.assertLint("var obj = { test: function() {} }; var key = 'test'; obj[key](); obj['test']();", {
		messages : [ ]
	}, null, IGNORE_UNUSED_VAR);
}

exports['test type-checking of object literals declared before a function with a known type'] = function() {
  
  // declaration before the argument
  util.assertLint("var x = {id: 'fooID',hidden: true}; chrome.app.window.create('index.html', x);", {
          messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // A Property that is unknown: anInvalidOption
  util.assertLint("var obj1 = {anInvalidOption: 'foo'}; chrome.app.window.create('index.html', obj1);", {
    "messages":[{"message":"Invalid argument at 2: anInvalidOption is not a property in CreateWindowOptions","from":12,"to":27,"severity":"error"}]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // A Property that does not type check, (hidden should be a bool)
  util.assertLint("var obj2 = {hidden: 'foo'}; chrome.app.window.create('index.html', obj2);", {
    "messages":[{"message":"Invalid argument at 2: cannot convert from String.prototype to Boolean.prototype","from":20,"to":25,"severity":"error"}]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);

  // A Property that is of the correct type => OK
  util.assertLint("var obj3 = {id: 'fooID'}; chrome.app.window.create('index.html', obj3);", {
    messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // multiple Properties of the correct type => OK
  util.assertLint("var obj4 = {id: 'fooID',hidden: true}; chrome.app.window.create('index.html', obj4);", {
    messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // one bad one mixed in
  util.assertLint("var obj5 = {id: 'fooID', oho: 34, hidden: true}; chrome.app.window.create('index.html', obj5);", {
    "messages":[{"message":"Invalid argument at 2: oho is not a property in CreateWindowOptions","from":25,"to":28,"severity":"error"}]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);

  // id is forward declared object literal but it should be string
  util.assertLint("var lit = {foo: 400}; document.getElementById(lit);", {
          messages : [ {
            "message":"Invalid argument at 1: cannot convert from Object.prototype to String.prototype","from":46,"to":49,"severity":"error"
          }]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
}

exports['test Invalid Argument'] = function() {

  // id is an object literal but it should be string 
  util.assertLint("var elt = document.getElementById({foo: 400});", {
          messages : [ {
            "message":"Invalid argument at 1: cannot convert from Object.prototype to String.prototype","from":34,"to":44,"severity":"error"
          }]
  }, [ "browser" ], IGNORE_UNUSED_VAR);  
  
  // #JSObjectLiteralInParameter
  // a Property that is unknown: anInvalidOption
  util.assertLint("chrome.app.window.create('index.html', {anInvalidOption: 'foo'});", {
          messages : [{
          "message":"Invalid argument at 2: anInvalidOption is not a property in CreateWindowOptions",
          "from":40,
          "to":55,
          "severity":"error"
          }]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // a Property that does not type check, (hidden should be a bool)
  util.assertLint("chrome.app.window.create('index.html', {hidden: 'foo'});", {
          messages : [{
            "message":"Invalid argument at 2: cannot convert from String.prototype to Boolean.prototype",
            "from":48,
            "to":53,
            "severity":"error"
          }]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // a Property that is of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID'});", {
          messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // multiple Properties of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID',hidden: true});", {
          messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // one bad one mixed in
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID', oho: 34, hidden: true});", {
          messages : [{
          "message":"Invalid argument at 2: oho is not a property in CreateWindowOptions",
          "from":53,
          "to":56,
          "severity":"error"
          }]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);

  // id is string => OK 
  util.assertLint("var elt = document.getElementById('100');", {
          messages : []  
  }, [ "browser" ], IGNORE_UNUSED_VAR);  
  // id is string => OK 
  util.assertLint("var id = '100'; var elt = document.getElementById(id);", {
          messages : []  
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // id is number although it should be string 
  util.assertLint("var elt = document.getElementById(100);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from Number.prototype to String.prototype",
            "from": 34,
            "to": 37,
            "severity": "error"}]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // id is number although it should be string 
  util.assertLint("var id = 100; var elt = document.getElementById(id);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from Number.prototype to String.prototype",
            "from": 48,
            "to": 50,
            "severity": "error"}]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // listener must be a function => OK 
  util.assertLint("var f = function() {}; document.addEventListener('click', f, true)", {
          messages : []
  }, [ "browser" ], IGNORE_UNUSED_VAR);  
  // listener must be a function but argument is a boolean 
  util.assertLint("var b = true; document.addEventListener('click', b, true)", {
          messages : [{
            "message": "Invalid argument at 2: cannot convert from Boolean.prototype to Function.prototype",
            "from": 49,
            "to": 50,
            "severity": "error"}]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // null argument => OK 
  util.assertLint("var elt = document.getElementById(null);", {
          messages : []
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // Unknown argument => throw error widh Unknown identifier
  util.assertLint("var elt = document.getElementById(xxx);", {
          messages : [{
            "message" : "Unknown identifier 'xxx'",
            "from" : 34,
            "to" : 37,
            "severity" : "warning"
    }]
  }, [ "browser" ], IGNORE_UNUSED_VAR); 
  
  // isEqualNode waits Node.prototype and document.getElementById returns Element.prototype which extends Node.prototype => OK
  util.assertLint("document.getElementById('id1').isEqualNode(document.getElementById('id2'))", {
          messages : []
  }, [ "browser" ]); 
  
  // New expression works like Call expression
  util.assertLint("new Array('');", {
    messages : [{
      "message" : "Invalid argument at 1: cannot convert from String.prototype to Number.prototype",
      "from" : 10,
      "to" : 12,
      "severity" : "error"
    }]
  }, [ "ecma5" ]); 
  
}

exports['test Unused variable'] = function() {
  // Unknown property
  util.assertLint("var id1='100';\n" +
                  "var id2='100'; console.log(id2);\n" +
                  "var id3='100', id4 = id3;", {
          messages : [ {
                  "message" : "Unused variable 'id1'",
                  "from" : 4,
                  "to" : 7,
                  "severity" : "warning"
                  },{
                  "message" : "Unused variable 'id4'",
                  "from" : 63,
                  "to" : 66,
                  "severity" : "warning"
          } ]
  }, [ "browser" ]);    
}

exports['test Unused function'] = function() {
  // Unknown property
  util.assertLint("var f=function(){};\n" +
                  "var g=function(){};\ng();\n" + 
                  "function f1(){};\n" + 
                  "function g1(){};\ng1();\n", {
          messages : [ {
                  "message" : "Unused variable 'f'",
                  "from" : 4,
                  "to" : 5,
                  "severity" : "warning"
                  },
                  {
                    "message" : "Unused function 'f1'",
                    "from" : 54,
                    "to" : 56,
                    "severity" : "warning"
            }]
  }, [ "browser" ]);    
}

if (module == require.main)
	require('test').run(exports)
