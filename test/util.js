"use strict";

var fs = require("fs"), path = require("path"), tern = require("tern"), assert = require('assert');
require("../lint.js");


var projectDir = path.resolve(__dirname, "..");
var resolve = function(pth) {
  return path.resolve(projectDir, pth);
};
var browser = JSON.parse(fs
    .readFileSync(resolve("node_modules/tern/defs/browser.json")), "utf8");
var ecma5 = JSON.parse(fs
    .readFileSync(resolve("node_modules/tern/defs/ecma5.json")), "utf8");
var chrome_apps = JSON.parse(fs
    .readFileSync(resolve("test/fixtures/chrome-apps.json")), "utf8");

var allDefs = {
  browser : browser,
  ecma5 : ecma5,
  chrome_apps : chrome_apps
};

var createServer = exports.createServer = function(defNames, plugins, options, useJSDoc) {
  var defs = [];  
  if (defNames) {
    for (var i = 0; i < defNames.length; i++) {
      var def = allDefs[defNames[i]];
      defs.push(def);
    }
  }
  if (!plugins) plugins = {};
  plugins["lint"] = options ? options : {};
  if (useJSDoc) {
    // JSDoc must be used, add the doc_comment with "strong" option
    require("tern/plugin/doc_comment");
    plugins['doc_comment'] = {"strong": true};
  }
  var server = new tern.Server({
    plugins : plugins,
    defs : defs
  });
  return server;
}

var assertLintReponse = exports.assertLintReponse = function(err, resp, expected) {
  if (err)
    throw err;
  var actualMessages = resp.messages;
  var expectedMessages = expected.messages;
  assert.equal(JSON.stringify(resp), JSON.stringify(expected));
}

exports.assertLint = function(text, expected, defNames, plugins, options, useJSDoc) {
  var server = createServer(defNames, plugins, options, useJSDoc);
  server.addFile("test1.js", text);
  server.request({
    query : {
      type : "lint",
      file : "test1.js"
    }
  }, function(err, resp) {
    assertLintReponse(err, resp, expected);
  });
}