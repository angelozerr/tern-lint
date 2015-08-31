var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test type-checking of object literals declared before a function with a known type'] = function() {
  
  // declaration before the argument
  util.assertLint("var x = {id: 'fooID',hidden: true}; chrome.app.window.create('index.html', x);", {
          messages : []
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  
  // A Property that is unknown: anInvalidOption
  util.assertLint("var obj1 = {anInvalidOption: 'foo'}; chrome.app.window.create('index.html', obj1);", {
    "messages":[{"message":"Invalid property at 1: anInvalidOption is not a property in CreateWindowOptions","from":12,"to":27,"severity":"error",
      "file": "test1.js"}]
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  
  // A Property that does not type check, (hidden should be a bool)
  util.assertLint("var obj2 = {hidden: 'foo'}; chrome.app.window.create('index.html', obj2);", {
    "messages":[{"message":"Invalid property at 1: cannot convert from string to bool","from":20,"to":25,"severity":"error",
      "file": "test1.js"}]
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);

  // A Property that is of the correct type => OK
  util.assertLint("var obj3 = {id: 'fooID'}; chrome.app.window.create('index.html', obj3);", {
    messages : []
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  
  // multiple Properties of the correct type => OK
  util.assertLint("var obj4 = {id: 'fooID',hidden: true}; chrome.app.window.create('index.html', obj4);", {
    messages : []
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  
  // one bad one mixed in
  util.assertLint("var obj5 = {id: 'fooID', oho: 34, hidden: true}; chrome.app.window.create('index.html', obj5);", {
    "messages":[{"message":"Invalid property at 2: oho is not a property in CreateWindowOptions","from":25,"to":28,"severity":"error",
      "file": "test1.js"}]
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);

  // id is forward declared object literal but it should be string
  util.assertLint("var lit = {foo: 400}; document.getElementById(lit);", {
          messages : [ {
            "message":"Invalid argument at 1: cannot convert from lit to string","from":46,"to":49,"severity":"error",
            "file": "test1.js"
          }]
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);
}

exports['test Invalid Object Literal property'] = function() {
  
  // #JSObjectLiteralInParameter
  // a Property that is unknown: anInvalidOption
  util.assertLint("chrome.app.window.create('index.html', {anInvalidOption: 'foo'});", {
          messages : [{
          "message":"Invalid property at 1: anInvalidOption is not a property in CreateWindowOptions",
          "from":40,
          "to":55,
          "severity":"error",
          "file": "test1.js"
          }]
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  // a Property that does not type check, (hidden should be a bool)
  util.assertLint("chrome.app.window.create('index.html', {hidden: 'foo'});", {
          messages : [{
            "message":"Invalid property at 1: cannot convert from string to bool",
            "from":48,
            "to":53,
            "severity":"error",
            "file": "test1.js"
          }]
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  // a Property that is of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID'});", {
          messages : []
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  // multiple Properties of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID',hidden: true});", {
          messages : []
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
  // one bad one mixed in
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID', oho: 34, hidden: true});", {
          messages : [{
          "message":"Invalid property at 2: oho is not a property in CreateWindowOptions",
          "from":53,
          "to":56,
          "severity":"error",
          "file": "test1.js"
          }]
  }, [ "chrome_apps" ], null, IGNORE_UNUSED_VAR);
}

if (module == require.main) require('test').run(exports)
