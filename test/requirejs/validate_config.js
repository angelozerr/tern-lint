var util = require("../util");
require("tern/plugin/requirejs");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test RequireJS config'] = function() {
   
    // Boolean
    util.assertLint("requirejs.config({baseUrl:'', XXXX:true})", {
        messages : [{"message":"Invalid property at 2: XXXX is not a property in config",
                     "from":30,
                     "to":34,
                     "severity":"error",
                     "file":"test1.js"}]
    }, [ "ecma5", "browser" ], { "requirejs" : {}}, IGNORE_UNUSED_VAR, true);
    
}
