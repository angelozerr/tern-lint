var util = require("../util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

// See https://github.com/angelozerr/tern-lint/issues/31
exports['test Assignment of wrong type, according to JSDoc (issue 31)'] = function() {
    
    // Boolean
    util.assertLint("/**\n * @type {Boolean}\n */\nvar test\ntest = 'hello'", {
        messages : [{"message":"Type mismatch: cannot convert from bool to string",
                     "from":43,
                     "to":50,
                     "severity":"warning",
                     "file":"test1.js"}]
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR);
    
    // Boolean|Number
    util.assertLint("/**\n * @type {Boolean|Number}\n */\nvar test\ntest = 'hello'", {
        messages : [{"message":"Type mismatch: cannot convert from bool|number to string",
                     "from":50,
                     "to":57,
                     "severity":"warning",
                     "file":"test1.js"}]
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR);
    
    // String
    util.assertLint("/**\n * @type {String}\n */\nvar test\ntest = 'hello'", {
        messages : []
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR);    

    // Boolean|String
    util.assertLint("/**\n * @type {Boolean|String}\n */\nvar test\ntest = 'hello'", {
        messages : []
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR); 
}

//See https://github.com/angelozerr/tern-lint/issues/31
exports['test variable assignment of wrong type, according to JSDoc (issue 58)'] = function() {
    
    // Boolean
    util.assertLint("/**\n * @type {Boolean}\n */\nvar test = 'hello'", {
        messages : [{"message":"Type mismatch: cannot convert from bool to string",
                     "from":38,
                     "to":45,
                     "severity":"warning",
                     "file":"test1.js"}]
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR);
}