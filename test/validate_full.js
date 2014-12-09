"use strict";

var util = require("./util");

exports['test full'] = function() {

  // Unused variable 'a'
  var server = util.createServer([ "browser" ]);
  server.addFile("test1.js", "var a = '';");
  server.request({
    query : {
      type : "lint-full"
    }
  }, function(err, resp) {

    var messages = {
      "messages" : [ {
        "message" : "Unused variable 'a'",
        "from" : 4,
        "to" : 5,
        "severity" : "warning",
        "file" : "test1.js"
      } ]
    };

    util.assertLintReponse(err, resp, messages);
  });

  // Use variable 'a' in a test2.js file
  server.addFile("test2.js", "console.log(a);");
  server.request({
    query : {
      type : "lint-full"
    }
  }, function(err, resp) {

    var messages = {
      "messages" : []
    };

    util.assertLintReponse(err, resp, messages);
  });

  // Remove test2.js, error Unused variable appears again
  server.delFile("test2.js");
  server.request({
    query : {
      type : "lint-full"
    }
  }, function(err, resp) {

    var messages = {
      "messages" : [ {
        "message" : "Unused variable 'a'",
        "from" : 4,
        "to" : 5,
        "severity" : "warning",
        "file" : "test1.js"
      } ]
    };
    util.assertLintReponse(err, resp, messages);
  });

}

exports['test full group by files'] = function() {

  // Unused variable 'a'
  var server = util.createServer([ "browser" ]);
  server.addFile("test1.js", "var a = '';");
  server.addFile("test2.js", "var b, c, d = '';");
  server.addFile("test3.js", "console.log(c);");
  server.request({
    query : {
      type : "lint-full",
      groupByFiles: true
    }
  }, function(err, resp) {

    var messages = {"messages":[
      {"file":"test1.js","messages":[{"message":"Unused variable 'a'","from":4,"to":5,"severity":"warning"}]},
      {"file":"test2.js","messages":[{"message":"Unused variable 'b'","from":4,"to":5,"severity":"warning"}, {"message":"Unused variable 'd'","from":10,"to":11,"severity":"warning"}]},
      {"file":"test3.js","messages":[]}
    ]};

    util.assertLintReponse(err, resp, messages);
  });
}
if (module == require.main) require('test').run(exports)