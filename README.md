tern.lint
=========

[![Build Status](https://secure.travis-ci.org/angelozerr/tern.lint.png)](http://travis-ci.org/angelozerr/tern.lint)

**tern.lint** provides :

 * the tern lint plugin `lint.js` to validate JS files.
 * the CodeMirror lint addon `tern-lint.js` which uses tern lint plugin `lint.js`

# Integration

See [Integration](https://github.com/angelozerr/tern.lint/wiki/Integration) for more information to integrate the tern lint plugin in your editor.

## with CodeMirror : 

Here a screenshot with tern lint and CodeMirror :

![CodeMirror & TernLint](https://github.com/angelozerr/tern.lint/wiki/images/CodeMirrorAddon_TernLintOverview.png)

## with Eclipse :

If you are Eclipse user, you can use the tern lint.js too. See [Tern IDE & Validation](https://github.com/angelozerr/tern.java/wiki/Tern-&-Validation)

![Eclipse & TernLint](https://github.com/angelozerr/tern.lint/wiki/images/EclipseIDE_TernLintOverview.png)

## with Emacs 

![Emacs & TernLint](https://camo.githubusercontent.com/a0aee78d66237ddc65e4ab1291ccbb496f52fd25/687474703a2f2f692e696d6775722e636f6d2f723335615244512e706e67)

See [tern-lint.el](https://github.com/katspaugh/tern-lint.el) for more information.

## with other editor

If you wish to integrate the tern lint with an editor (vim, etc), here the **JSON request** to post to the tern server : 

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
	
and the **JSON response** of the tern server : 	

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
	
## Validation rules

tern lint validate JS files but not syntax errors, it manages those validation rules : 

 * unknown property. (ex : document.getElementByIdXXX  where getElementByIdXXX is an unknown property of document)
 * unknown identifier. (ex : a = '' where a is an unknown identifier)
 * not a function (ex : var a = []; a.length() is not valid because length of array is not a function)
  
See [Validation rules](https://github.com/angelozerr/tern.lint/wiki/Validation-Rules) for more informations.

## Structure

The basic structure of the project is given in the following way:

* `demos/` demos with tern lint plugin which use CodeMirror.
* `codemirror/` contains the CodeMirror lint addon `tern-lint.js`, which is an implementation of CodeMirror lint addon with tern.lint.
* `plugin/` contains the tern lint plugin `lint.js`
* `test/` contains test of tern lint plugin. 
