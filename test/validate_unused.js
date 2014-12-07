var util = require("./util");

exports['test Unused variable'] = function() {
  // Unused property
  util.assertLint("var id1='100';\n" +
                  "var id2='100'; console.log(id2);\n" +
                  "var id3='100', id4 = id3;", {
          messages : [ {
                  "message" : "Unused variable 'id1'",
                  "from" : 4,
                  "to" : 7,
                  "severity" : "warning"
                  },{
                  "message" : "Unused variable 'id4'",
                  "from" : 63,
                  "to" : 66,
                  "severity" : "warning"
          } ]
  }, [ "browser" ]);    
}

exports['test Unused function'] = function() {
  // Unused function
  util.assertLint("var f=function(){};\n" +
                  "var g=function(){};\ng();\n" + 
                  "function f1(){};\n" + 
                  "function g1(){};\ng1();\n", {
          messages : [ {
                  "message" : "Unused variable 'f'",
                  "from" : 4,
                  "to" : 5,
                  "severity" : "warning"
                  },
                  {
                    "message" : "Unused function 'f1'",
                    "from" : 54,
                    "to" : 56,
                    "severity" : "warning"
            }]
  }, [ "browser" ]);    
}

if (module == require.main) require("test").run(exports);