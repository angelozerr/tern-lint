var util = require("../util");

// See https://github.com/angelozerr/tern-lint/issues/52
exports['test [ES6] Validation for modules from (issue 52)'] = function() {
    
    util.assertLint("import {List, XXX} from './list'\nimport * as myMath from './mymath'", {
        messages : [{"message":"Invalid modules from './list'","from":24,"to":32,"severity":"error","file":"test1.js"},
                    {"message":"Invalid modules from './mymath'","from":57,"to":67,"severity":"error","file":"test1.js"}]
    }, null, {"es_modules": {}});
    
}

exports['test [ES6] Validation for modules specifier (issue 52)'] = function() {
    
  util.assertLint("import {List, XXX} from './list'\nimport * as myMath from './mymath'", {
    messages : [{"message":"Invalid modules specifier 'XXX'","from":14,"to":17,"severity":"error","file":"test1.js"},
                {"message":"Invalid modules from './mymath'","from":57,"to":67,"severity":"error","file":"test1.js"}]
  }, null, {"es_modules": {}}, null, [{"name": "list", text: "export class List {}"}]);
  
}