var util = require("../util");

// See https://github.com/angelozerr/tern-lint/issues/71
exports['test [ES6] class (issue 71)'] = function() {
    
    util.assertLint("class Foo extends Bar {\n  constructor() {\n super();\n }\n}", {
        messages : [{"message":"Unknown identifier 'Bar'","from":18,"to":21,"severity":"warning","file":"test1.js"}]
    }, [ "browser" ]);  
 
}