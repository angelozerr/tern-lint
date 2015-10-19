tern-lint
=========

[![Build Status](https://secure.travis-ci.org/angelozerr/tern-lint.png)](http://travis-ci.org/angelozerr/tern-lint)
[![NPM version](https://img.shields.io/npm/v/tern-lint.svg)](https://www.npmjs.org/package/tern-lint)  

[tern-lint](https://github.com/angelozerr/tern-lint) is a tern plugin which is able to validate JavaScripts files to collect **semantic errors**. It is **static type checker** like [flow](http://flowtype.org/). It's the main difference with other famous linters like [JSHint](http://jshint.com/), [ESLint](http://eslint.org/), [JSCS ](http://jscs.info/) which validate JavaScript files to collect **syntax errors**.

What do you mean with semantic errors? Invalid argument is a sample of semantic error :

![Invalid Argument](https://github.com/angelozerr/tern-lint/wiki/images/CodeMirrorAddon_InvalidArgument.png)

See [Validation rules](https://github.com/angelozerr/tern-lint/wiki/Validation-Rules) for more informations.

[tern-lint](https://github.com/angelozerr/tern-lint) is able to use JSDoc annotations for the validation : 

![Type mismatch by using JSDoc](https://github.com/angelozerr/tern-lint/wiki/images/CodeMirrorAddon_TypeMismatchByUsingJSDoc.png)

See [Validation with JSDoc](https://github.com/angelozerr/tern-lint/wiki/Validation-JSDoc) for more informations.
 
[tern-lint](https://github.com/angelozerr/tern-lint) provides :

 * the tern lint plugin `lint.js` to validate JavaScript files.
 * the CodeMirror lint addon `tern-lint.js` which uses tern lint plugin `lint.js`
 * the `bin/lint` to use tern lint with command line.
 
# Usage

[tern-lint](https://github.com/angelozerr/tern-lint) can be used :

 * with a [JavaScript editor](https://github.com/angelozerr/tern-lint/wiki/Editors) if the editor supports it. 
 * with [Command line](https://github.com/angelozerr/tern-lint/wiki/Command-Line). 

See [Usage](https://github.com/angelozerr/tern-lint/wiki/Home) for more informations.

## Editors

Today several JavaScript editors supports [tern-lint](https://github.com/angelozerr/tern-lint) : 

### CodeMirror : 

Here a screenshot with tern lint and CodeMirror :

![CodeMirror & TernLint](https://github.com/angelozerr/tern-lint/wiki/images/CodeMirrorAddon_TernLintOverview.png)

### Eclipse :

If you are Eclipse user, you can use the tern lint.js too. See [Tern IDE & Validation](https://github.com/angelozerr/tern.java/wiki/Tern-Linter-Lint)

![Eclipse & TernLint](https://github.com/angelozerr/tern-lint/wiki/images/EclipseIDE_TernLintOverview.png)

### Emacs 

![Emacs & TernLint](https://github.com/angelozerr/tern-lint/wiki/images/EmacsAddon_TernLintOverview.png)

See [tern-lint.el](https://github.com/katspaugh/tern-lint.el) for more information.

### Atom

![Atom & TernLint]
(https://github.com/angelozerr/tern-lint/wiki/images/AtomAddon_TernLintOverview.png)

See [atom-ternjs](https://github.com/tststs/atom-ternjs) for more information.

### Other editors

If you wish to integrate the tern lint with an editor (Vim, Sublime, etc), here the **JSON request** to post to the tern server : 

```json
{
 "query": {
  "type": "lint",
  "file": "test.js",
  "files": [
   {
    "name": "test.js",
    "text": "var elt = document.getElementByIdXXX('myId');",
    "type": "full"
   }
  ]
 }
}
```
	
and the **JSON response** of the tern server : 	

```json
{
 "messages": [
  {
   "message": "Unknow property 'getElementByIdXXX'",
   "from": 19,
   "to": 36,
   "severity": "warning"
  }
 ]
}
```

## Command line

Install tern-lint with npm like this :

```
$ npm install -g tern-lint
```

Go at in your folder which contains your JavaScripts files to validate :

```
$ cd your/folder/which/contains/javascript/files
```

Execute the lint :

```
$ lint --format
```

The shell window should display errors like this :

```json
{
 "messages": [
  {
   "message": "Unknow property 'getElementByIdXXX'",
   "from": 19,
   "to": 36,
   "severity": "warning"
  }
 ]
}
```

See [Command Line](https://github.com/angelozerr/tern-lint/wiki/Command-Line) for more informations.
	
# Validation rules

## Native

tern lint validate JS files but not syntax errors, it manages those validation rules : 

 * `unknown property`. (ex : document.getElementByIdXXX  where getElementByIdXXX is an unknown property of document)
 * `unknown identifier`. (ex : a = '' where a is an unknown identifier)
 * `not a function` (ex : var a = []; a.length() is not valid because length of array is not a function)
 * `invalid argument` (ex : document.getElementById(1000) is not valid because 1000 is a number and not a string)
  
See [Validation rules](https://github.com/angelozerr/tern-lint/wiki/Validation-Rules) for more informations.

## Custom

You can develop a custom lint to validate anything. Here a list of tern plugin which provides custom lint : 

 * [YUI3](https://github.com/angelozerr/tern-aui2.0.x/wiki/Features#yui-use-module) to validate YUI3 modules.
 * [Node Extension](https://github.com/angelozerr/tern-node-extension) to validate required modules.
 * [RequireJS Extension](https://github.com/angelozerr/tern-requirejs-extension) to validate required modules.
 * [Browser Extension](https://github.com/angelozerr/tern-browser-extension) to validate syntax of CSS selectors, elements IDS.
 * [jQuery Extension](https://github.com/angelozerr/tern-jquery-extension) to validate syntax of CSS selectors, elements IDS.
 * [Tabris](https://github.com/angelozerr/tern-tabris) to validate tabris action.
   
# Structure

The basic structure of the project is given in the following way:

* `bin/` contains the lint command to use tern-lint with command line. 
* `codemirror/` contains the CodeMirror lint addon `tern-lint.js`, which is an implementation of CodeMirror lint addon with tern-lint.
* `demos/` demos with tern lint plugin which use CodeMirror.
* `lint.js` the tern lint plugin.
* `test/` contains test of tern lint plugin.