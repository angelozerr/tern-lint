var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test Known property'] = function() {
	// Known property document.getElementById
	util.assertLint("var elt = document.getElementById('myId');", {
		messages : []
	}, [ "browser" ], null, IGNORE_UNUSED_VAR);
}

exports['test Unknown property'] = function() {
        
	// Unknown property
	util.assertLint("var elt = document.getElementByIdXXX('myId');", {
		messages : [ {
			"message" : "Unknown property 'getElementByIdXXX'",
			"from" : 19,
			"to" : 36,
			"severity" : "warning",
			"file": "test1.js"
		} ]
	}, [ "browser" ], null, IGNORE_UNUSED_VAR);
	// Unknown property as error
	var options = {"rules" : {"UnknownProperty" : {"severity" : "error"}, 
	                          "UnusedVariable" :  {"severity" : "none"}}};
	util.assertLint("var elt = document.getElementByIdXXX('myId');", {
		messages : [ {
			"message" : "Unknown property 'getElementByIdXXX'",
			"from" : 19,
			"to" : 36,
			"severity" : "error",
                        "file": "test1.js"
		} ]
	}, [ "browser" ], null, options);	
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
			"severity" : "warning",
                        "file": "test1.js"
		} ]
	}, null, null, IGNORE_UNUSED_VAR);
	// Unknown identifier as error
	var options = {"rules" : {"UnknownIdentifier" : {"severity" : "error"},
	                          "UnusedVariable" :  {"severity" : "none"}}};
	util.assertLint("var elt = document.getElementById('myId');", {
		messages : [ {
			"message" : "Unknown identifier 'document'",
			"from" : 10,
			"to" : 18,
			"severity" : "error",
                        "file": "test1.js"
		} ]
	}, null, null, options);	
}

exports['test issue1'] = function() {
	// Known property for this. See issue
	// https://github.com/angelozerr/tern.lint/issues/1
	util.assertLint("var a = [];\nvar len = a.length();", {
		messages : [ {
			"message" : "'length' is not a function",
			"from" : 24,
			"to" : 30,
			"severity" : "error",
                        "file": "test1.js"
		} ]
	}, [ "ecma5" ], null, IGNORE_UNUSED_VAR);
	// Not a function as warning
	var options = {"rules" : {"NotAFunction" : {"severity" : "warning"},
	                          "UnusedVariable" :  {"severity" : "none"}}};	
	util.assertLint("var a = [];\nvar len = a.length();", {
		messages : [ {
			"message" : "'length' is not a function",
			"from" : 24,
			"to" : 30,
			"severity" : "warning",
                        "file": "test1.js"
		} ]
	}, [ "ecma5" ], null, options);	
	// without ecma5, var 'a' is not an array.
	util.assertLint("var a = [];\nvar len = a.length();", {
		messages : [ {
			"message" : "Unknown property 'length'",
			"from" : 24,
			"to" : 30,
			"severity" : "warning",
                        "file": "test1.js"
		} ]
	}, null, null, IGNORE_UNUSED_VAR);
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
	}, null, null, IGNORE_UNUSED_VAR);

	util.assertLint("function b() { }\nfunction test() { var d = 5; var a = {len: 5}; var len = a.len; }", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);
}


exports['test functions parameters'] = function() {
	// In this case the type of `a` is inferred as a string
	util.assertLint("function test(a) { var t = a; }; test('something');", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);

	// In this case the type is unknown, but the variable is defined
	// (should not produce a warning)
	util.assertLint("function test(a) { var t = a; };", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);
}


exports['test properties on functions parameters'] = function() {
	// In this case the type of `a` is inferred as an object with a property `len`.
	util.assertLint("function test(a) { var len = a.len; }; test({len: 5});", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);

	// In this case the type of `a` is unknown, and should not produce warnings
	// on any of its properties.
	util.assertLint("function test(a) { var len = a.len; };", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);

	// The same goes for function calls on an unknown type
	util.assertLint("function test(a) { var len = a.myLength(); };", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);
}

exports['test assignment of unknown value'] = function() {

	util.assertLint("var a = {}; function test(p) { var b = a.b; };", {
		messages : [ {
			"message": "Unknown property 'b'",
			"from": 41,
			"to": 42,
			"severity": "warning",
                        "file": "test1.js"} ]
	}, null, null, IGNORE_UNUSED_VAR);

	// The type of a.t is unknown, but it is still a valid property.
	util.assertLint("var a = {}; function test(p) { a.t = p; var b = a.t; }", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);

	util.assertLint("var a = {}; function test(p) { a.t = p; }", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);

	// This should only contain a warning for `notdefined`, not for b = a.val.
	util.assertLint("function A() {}; A.prototype.val = notdefined; var a = new A(); var b = a.val;", {
		messages : [ {
			"message": "Unknown identifier 'notdefined'",
			"from": 35,
			"to": 45,
			"severity": "warning",
            "file": "test1.js"} ]
	}, null, null, IGNORE_UNUSED_VAR);

	util.assertLint("var a = {t: 5}; function test(p) { a.t = p; }", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);
}

exports['test dynamic properties (bracket notation)'] = function() {
	util.assertLint("var obj = { test: 1 }; var key = 'test'; var val1 = obj[key]; var val2 = obj['test'];", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);

	util.assertLint("var obj = { test: function() {} }; var key = 'test'; obj[key](); obj['test']();", {
		messages : [ ]
	}, null, null, IGNORE_UNUSED_VAR);
}

exports['test undefined (issue 35)'] = function() {
  util.assertLint("undefined", {
          messages : []
  }, [ "ecma5" ], null, IGNORE_UNUSED_VAR);
}

exports['test Unknown property "x" (issue 17)'] = function() {
  
  util.assertLint("var a = {}; a.", {
          messages : []
  }, [ "ecma5" ], null, IGNORE_UNUSED_VAR);
  
  util.assertLint("var a = {}; a.xxx", {
    messages : [ {
      "message": "Unknown property 'xxx'",
      "from": 14,
      "to": 17,
      "severity": "warning",
      "file": "test1.js"} ]
  }, [ "ecma5" ], null, IGNORE_UNUSED_VAR);

}

exports['test issue13'] = function() {
  // See issue
  // https://github.com/angelozerr/tern-lint/issues/13
  util.assertLint("var b = {test: ''};\nvar a = '';\na = {test: function() {}};\na.test();", {
      messages : []
  }, [ "ecma5" ], null, IGNORE_UNUSED_VAR);
}

if (module == require.main) require('test').run(exports)
