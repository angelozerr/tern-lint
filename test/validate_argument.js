var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test type-checking of object literals declared before a function with a known type'] = function() {
  
  // declaration before the argument
  util.assertLint("var x = {id: 'fooID',hidden: true}; chrome.app.window.create('index.html', x);", {
          messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // A Property that is unknown: anInvalidOption
  util.assertLint("var obj1 = {anInvalidOption: 'foo'}; chrome.app.window.create('index.html', obj1);", {
    "messages":[{"message":"Invalid argument at 2: anInvalidOption is not a property in CreateWindowOptions","from":12,"to":27,"severity":"error",
      "file": "test1.js"}]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // A Property that does not type check, (hidden should be a bool)
  util.assertLint("var obj2 = {hidden: 'foo'}; chrome.app.window.create('index.html', obj2);", {
    "messages":[{"message":"Invalid argument at 2: cannot convert from String.prototype to Boolean.prototype","from":20,"to":25,"severity":"error",
      "file": "test1.js"}]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);

  // A Property that is of the correct type => OK
  util.assertLint("var obj3 = {id: 'fooID'}; chrome.app.window.create('index.html', obj3);", {
    messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // multiple Properties of the correct type => OK
  util.assertLint("var obj4 = {id: 'fooID',hidden: true}; chrome.app.window.create('index.html', obj4);", {
    messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  
  // one bad one mixed in
  util.assertLint("var obj5 = {id: 'fooID', oho: 34, hidden: true}; chrome.app.window.create('index.html', obj5);", {
    "messages":[{"message":"Invalid argument at 2: oho is not a property in CreateWindowOptions","from":25,"to":28,"severity":"error",
      "file": "test1.js"}]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);

  // id is forward declared object literal but it should be string
  util.assertLint("var lit = {foo: 400}; document.getElementById(lit);", {
          messages : [ {
            "message":"Invalid argument at 1: cannot convert from Object.prototype to String.prototype","from":46,"to":49,"severity":"error",
            "file": "test1.js"
          }]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
}

exports['test Invalid Argument'] = function() {

  // id is an object literal but it should be string 
  util.assertLint("var elt = document.getElementById({foo: 400});", {
          messages : [ {
            "message":"Invalid argument at 1: cannot convert from Object.prototype to String.prototype","from":34,"to":44,"severity":"error",
            "file": "test1.js"
          }]
  }, [ "browser" ], IGNORE_UNUSED_VAR);  
  
  // #JSObjectLiteralInParameter
  // a Property that is unknown: anInvalidOption
  util.assertLint("chrome.app.window.create('index.html', {anInvalidOption: 'foo'});", {
          messages : [{
          "message":"Invalid argument at 2: anInvalidOption is not a property in CreateWindowOptions",
          "from":40,
          "to":55,
          "severity":"error",
          "file": "test1.js"
          }]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // a Property that does not type check, (hidden should be a bool)
  util.assertLint("chrome.app.window.create('index.html', {hidden: 'foo'});", {
          messages : [{
            "message":"Invalid argument at 2: cannot convert from String.prototype to Boolean.prototype",
            "from":48,
            "to":53,
            "severity":"error",
            "file": "test1.js"
          }]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // a Property that is of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID'});", {
          messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // multiple Properties of the correct type => OK
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID',hidden: true});", {
          messages : []
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);
  // one bad one mixed in
  util.assertLint("chrome.app.window.create('index.html', {id: 'fooID', oho: 34, hidden: true});", {
          messages : [{
          "message":"Invalid argument at 2: oho is not a property in CreateWindowOptions",
          "from":53,
          "to":56,
          "severity":"error",
          "file": "test1.js"
          }]
  }, [ "chrome_apps" ], IGNORE_UNUSED_VAR);

  // id is string => OK 
  util.assertLint("var elt = document.getElementById('100');", {
          messages : []  
  }, [ "browser" ], IGNORE_UNUSED_VAR);  
  // id is string => OK 
  util.assertLint("var id = '100'; var elt = document.getElementById(id);", {
          messages : []  
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // id is number although it should be string 
  util.assertLint("var elt = document.getElementById(100);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from Number.prototype to String.prototype",
            "from": 34,
            "to": 37,
            "severity": "error",
            "file": "test1.js"}]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // id is number although it should be string 
  util.assertLint("var id = 100; var elt = document.getElementById(id);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from Number.prototype to String.prototype",
            "from": 48,
            "to": 50,
            "severity": "error",
            "file": "test1.js"}]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // listener must be a function => OK 
  util.assertLint("var f = function() {}; document.addEventListener('click', f, true)", {
          messages : []
  }, [ "browser" ], IGNORE_UNUSED_VAR);  
  // listener must be a function but argument is a boolean 
  util.assertLint("var b = true; document.addEventListener('click', b, true)", {
          messages : [{
            "message": "Invalid argument at 2: cannot convert from Boolean.prototype to Function.prototype",
            "from": 49,
            "to": 50,
            "severity": "error",
            "file": "test1.js"}]
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // null argument => OK 
  util.assertLint("var elt = document.getElementById(null);", {
          messages : []
  }, [ "browser" ], IGNORE_UNUSED_VAR);
  // Unknown argument => throw error widh Unknown identifier
  util.assertLint("var elt = document.getElementById(xxx);", {
          messages : [{
            "message" : "Unknown identifier 'xxx'",
            "from" : 34,
            "to" : 37,
            "severity" : "warning",
            "file": "test1.js"
    }]
  }, [ "browser" ], IGNORE_UNUSED_VAR); 
  
  // isEqualNode waits Node.prototype and document.getElementById returns Element.prototype which extends Node.prototype => OK
  util.assertLint("document.getElementById('id1').isEqualNode(document.getElementById('id2'))", {
          messages : []
  }, [ "browser" ]); 
  
  // New expression works like Call expression
  util.assertLint("new Array('');", {
    messages : [{
      "message" : "Invalid argument at 1: cannot convert from String.prototype to Number.prototype",
      "from" : 10,
      "to" : 12,
      "severity" : "error",
      "file": "test1.js"
    }]
  }, [ "ecma5" ]); 
}

if (module == require.main) require('test').run(exports)
