var util = require("./util");

exports['test RegExp'] = function() {
  // Valid RegExp
  util.assertLint("var s = '';\n" +
                  "s.match('/(chapter \d+(\.\d)*)/i')", {
          messages : []
  }, [ "ecma5" ]);

  // Invalid RegExp
  util.assertLint("var s = '';\n" +
      "s.match('/(chapter \d+(\.\d)*)/i)", {
      messages : [ {
            "message" : "Invalid argument at 1: SyntaxError: Invalid regular expression: //(chapter d+(.d)*)/i)/: Unmatched ')'",
            "from" : 20,
            "to" : 42,
            "severity" : "error",
            "file" : "test1.js"
            }]
}, [ "ecma5" ]);
  
}

if (module == require.main) require("test").run(exports);