var util = require("../util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

// See https://github.com/angelozerr/tern-lint/issues/49
exports['test [JSDoc] Validation for Array (issue 49)'] = function() {
    
    // NOK
    util.assertLint("/**\n * @type {Array.<Boolean|String>}\n */\nvar arr\narr = [10, '', 10, '', true, {}]", {
        messages : [{"message":"Invalid item at 1: cannot convert from number to bool|string","from":57,"to":59,"severity":"error","file":"test1.js"},
                    {"message":"Invalid item at 3: cannot convert from number to bool|string","from":65,"to":67,"severity":"error","file":"test1.js"},
                    {"message":"Invalid item at 6: cannot convert from Object.prototype to bool|string","from":79,"to":81,"severity":"error","file":"test1.js"}]
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR);
    
    // Boolean|String
    util.assertLint("/**\n * @type {Array.<Boolean|String>}\n */\nvar arr\narr = ['', '', true]", {
        messages : []
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR);    
 
}