var util = require("./util");

exports['test Known property'] = function() {
	// Known property document.getElementById
	util.assertLint("var elt = document.getElementById('myId');", {
		messages : []
	}, [ "browser" ]);
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
	}, [ "browser" ]);
	// Unknown property as error
	var options = {"rules" : {"UnknownProperty" : {"severity" : "error"}}};
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
	});
	// Unknown identifier as error
	var options = {"rules" : {"UnknownIdentifier" : {"severity" : "error"}}};
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
	}, [ "ecma5" ]);
	// Not a function as warning
	var options = {"rules" : {"NotAFunction" : {"severity" : "warning"}}};
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
	});
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
	});

	util.assertLint("function b() { }\nfunction test() { var d = 5; var a = {len: 5}; var len = a.len; }", {
		messages : [ ]
	});
}


exports['test functions parameters'] = function() {
	// In this case the type of `a` is inferred as a string
	util.assertLint("function test(a) { var t = a; }; test('something');", {
		messages : [ ]
	});

	// In this case the type is unknown, but the variable is defined
	// (should not produce a warning)
	util.assertLint("function test(a) { var t = a; };", {
		messages : [ ]
	});
}


exports['test properties on functions parameters'] = function() {
	// In this case the type of `a` is inferred as an object with a property `len`.
	util.assertLint("function test(a) { var len = a.len; }; test({len: 5});", {
		messages : [ ]
	});

	// In this case the type of `a` is unknown, and should not produce warnings
	// on any of its properties.
	util.assertLint("function test(a) { var len = a.len; };", {
		messages : [ ]
	});

	// The same goes for function calls on an unknown type
	util.assertLint("function test(a) { var len = a.myLength(); };", {
		messages : [ ]
	});
}


exports['test assignment of unknown value'] = function() {

	util.assertLint("var a = {}; function test(p) { var b = a.b; };", {
		messages : [ {
			"message": "Unknown property 'b'",
			"from": 41,
			"to": 42,
			"severity": "warning"} ]
	});

	// The type of a.t is unknown, but it is still a valid property.
	util.assertLint("var a = {}; function test(p) { a.t = p; var b = a.t; }", {
		messages : [ ]
	});

	util.assertLint("var a = {}; function test(p) { a.t = p; }", {
		messages : [ ]
	});

	// This should only contain a warning for `notdefined`, not for b = a.val.
	util.assertLint("function A() {}; A.prototype.val = notdefined; var a = new A(); var b = a.val;", {
		messages : [ {
			"message": "Unknown identifier 'notdefined'",
			"from": 35,
			"to": 45,
			"severity": "warning"} ]
	});

	util.assertLint("var a = {t: 5}; function test(p) { a.t = p; }", {
		messages : [ ]
	});
}

exports['test dynamic properties (bracket notation)'] = function() {
	util.assertLint("var obj = { test: 1 }; var key = 'test'; var val1 = obj[key]; var val2 = obj['test'];", {
		messages : [ ]
	});

	util.assertLint("var obj = { test: function() {} }; var key = 'test'; obj[key](); obj['test']();", {
		messages : [ ]
	});
}

exports['test Invalid Argument'] = function() {

  // #JSObjectLiteralInParameter
  // a Property that is unknown: anInvalidOption
  util.assertLint("chrome.app.window.create('index.html', {anInvalidOption: 'foo'});", {
          messages : [{
          "message":"Invalid argument at 2: anInvalidOption is not a property in CreateWindowOptions",
          "from":40,
          "to":55,
          "severity":"error"
          }]
  }, [ "chrome_apps" ]);
  // a Property that does not type check, (hidden should be a bool)
  util.assertLint("chrome.app.window.create('index.html', {hidden: 'foo'});", {
          messages : [{
            "message":"Invalid argument at 2: cannot convert from String.prototype to Boolean.prototype",
            "from":48,
            "to":53,
            "severity":"error"
          }]
  }, [ "chrome_apps" ]);
  // a Property that is of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID'});", {
          messages : []
  }, [ "chrome_apps" ]);
  // multiple Properties of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID',hidden: true});", {
          messages : []
  }, [ "chrome_apps" ]);
  // one bad one mixed in
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID', oho: 34, hidden: true});", {
          messages : [{
          "message":"Invalid argument at 2: oho is not a property in CreateWindowOptions",
          "from":53,
          "to":56,
          "severity":"error"
          }]
  }, [ "chrome_apps" ]);
  /* TODO
  // declaration before the argument
  util.assertLint("var x = {id: 'fooID',hidden: true}; chrome.app.window.create('index.html', x);", {
          messages : []
  }, [ "chrome_apps" ]);
  */

  // id is string => OK 
  util.assertLint("var elt = document.getElementById('100');", {
          messages : []  
  }, [ "browser" ]);  
  // id is string => OK 
  util.assertLint("var id = '100'; var elt = document.getElementById(id);", {
          messages : []  
  }, [ "browser" ]);
  // id is number although it should be string 
  util.assertLint("var elt = document.getElementById(100);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from Number.prototype to String.prototype",
            "from": 34,
            "to": 37,
            "severity": "error"}]
  }, [ "browser" ]);
  // id is number although it should be string 
  util.assertLint("var id = 100; var elt = document.getElementById(id);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from Number.prototype to String.prototype",
            "from": 48,
            "to": 50,
            "severity": "error"}]
  }, [ "browser" ]);
  // listener must be a function => OK 
  util.assertLint("var f = function() {}; document.addEventListener('click', f, true)", {
          messages : []
  }, [ "browser" ]);  
  // listener must be a function but argument is a boolean 
  util.assertLint("var b = true; document.addEventListener('click', b, true)", {
          messages : [{
            "message": "Invalid argument at 2: cannot convert from Boolean.prototype to Function.prototype",
            "from": 49,
            "to": 50,
            "severity": "error"}]
  }, [ "browser" ]);
  // null argument => OK 
  util.assertLint("var elt = document.getElementById(null);", {
          messages : []
  }, [ "browser" ]);
  // Unknown argument => throw error widh Unknown identifier
  util.assertLint("var elt = document.getElementById(xxx);", {
          messages : [{
            "message" : "Unknown identifier 'xxx'",
            "from" : 34,
            "to" : 37,
            "severity" : "warning"
    }]
  }, [ "browser" ]); 
  
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

if (module == require.main)
	require('test').run(exports)
