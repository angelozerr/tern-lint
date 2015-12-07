var util = require("../util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

// See https://github.com/angelozerr/tern-lint/issues/30
exports['test [JSDoc] Validation for Returns (issue 30)'] = function() {
  
    // NOK
    util.assertLint("/**\n * @returns {Boolean}\n */\nfunction test(state) {\nif (state) {\nreturn 'true'\n}else {\nreturn 'false'\n} return true;}", {
        messages : [{"message":"Invalid return type : cannot convert from string to bool","from":66,"to":79,"severity":"warning","file":"test1.js"},
                    {"message":"Invalid return type : cannot convert from string to bool","from":88,"to":102,"severity":"warning","file":"test1.js"}]
    }, [ "browser" ], {"doc_comment": {"strong": true}}, IGNORE_UNUSED_VAR);    
 

}