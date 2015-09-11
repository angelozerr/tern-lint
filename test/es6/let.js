var util = require("../util");

// See https://github.com/angelozerr/tern-lint/issues/54
exports['test [ES6] Validation for let (issue 54)'] = function() {
    
    util.assertLint("function f() {let a = ''; console.log(a)} f()", {
        messages : []
    }, [ "browser" ]);  
 
}