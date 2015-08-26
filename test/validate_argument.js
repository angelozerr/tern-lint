var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test Invalid Argument'] = function() {

  // id is an object literal but it should be string 
  util.assertLint("var elt = document.getElementById({foo: 400});", {
          messages : [ {
            "message":"Invalid argument at 1: cannot convert from Object.prototype to string","from":34,"to":44,"severity":"error",
            "file": "test1.js"
          }]
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);  
  
  // id is string => OK 
  util.assertLint("var elt = document.getElementById('100');", {
          messages : []  
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);  
  // id is string => OK 
  util.assertLint("var id = '100'; var elt = document.getElementById(id);", {
          messages : []  
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);
  // id is number although it should be string 
  util.assertLint("var elt = document.getElementById(100);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from number to string",
            "from": 34,
            "to": 37,
            "severity": "error",
            "file": "test1.js"}]
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);
  // id is number although it should be string 
  util.assertLint("var id = 100; var elt = document.getElementById(id);", {
          messages : [ {
            "message": "Invalid argument at 1: cannot convert from number to string",
            "from": 48,
            "to": 50,
            "severity": "error",
            "file": "test1.js"}]
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);
  // listener must be a function => OK 
  util.assertLint("var f = function() {}; document.addEventListener('click', f, true)", {
          messages : []
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);  
  // listener must be a function but argument is a boolean 
  util.assertLint("var b = true; document.addEventListener('click', b, true)", {
          messages : [{
            "message": "Invalid argument at 2: cannot convert from bool to Function.prototype",
            "from": 49,
            "to": 50,
            "severity": "error",
            "file": "test1.js"}]
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);
  // null argument => OK 
  util.assertLint("var elt = document.getElementById(null);", {
          messages : []
  }, [ "browser" ], null, IGNORE_UNUSED_VAR);
  // Unknown argument => throw error widh Unknown identifier
  util.assertLint("var elt = document.getElementById(xxx);", {
          messages : [{
            "message" : "Unknown identifier 'xxx'",
            "from" : 34,
            "to" : 37,
            "severity" : "warning",
            "file": "test1.js"
    }]
  }, [ "browser" ], null, IGNORE_UNUSED_VAR); 
  
  // isEqualNode waits Node.prototype and document.getElementById returns Element.prototype which extends Node.prototype => OK
  util.assertLint("document.getElementById('id1').isEqualNode(document.getElementById('id2'))", {
          messages : []
  }, [ "browser" ]); 
  
  // New expression works like Call expression
  util.assertLint("new Array('');", {
    messages : [{
      "message" : "Invalid argument at 1: cannot convert from string to number",
      "from" : 10,
      "to" : 12,
      "severity" : "error",
      "file": "test1.js"
    }]
  }, [ "ecma5" ]); 
}

if (module == require.main) require('test').run(exports)
