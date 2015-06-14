var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

// See https://github.com/angelozerr/tern-lint/issues/31
exports['test Assignment of wrong type, according to JSDoc'] = function() {
    // Known property document.getElementById
    util.assertLint("/**\n * @type {Boolean}\n */\nvar test\ntest = 'hello'", {
        messages : [{"message":"Type mismatch: cannot convert from Boolean.prototype to String.prototype",
                     "from":43,
                     "to":50,
                     "severity":"warning",
                     "file":"test1.js"}]
    }, [ "browser" ], IGNORE_UNUSED_VAR, true);
}
