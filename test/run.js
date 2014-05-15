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
}

exports['test Unknown property + identifier'] = function() {
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
	// The type of a.t is unknown, but it is still a valid property.
	util.assertLint("var a = {}; function test(p) { a.t = p; var b = a.t; };", {
		messages : [ ]
	});

	util.assertLint("var a = {t: 5}; function test(p) { a.t = p; };", {
		messages : [ ]
	});
}

if (module == require.main)
	require('test').run(exports)