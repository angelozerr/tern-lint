var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test issue36'] = function() {
    // String#replace waits String.prototype|RegExp.prototype
    util.assertLint("var s = '';\ns.replace(10", {
        messages : [{"message":"Invalid argument at 1: cannot convert from Number.prototype to String.prototype|RegExp.prototype",
          "from":22,
          "to":24,
          "severity":"error",
          "file":"test1.js"}]
    }, [ "ecma5" ], null, IGNORE_UNUSED_VAR);
}