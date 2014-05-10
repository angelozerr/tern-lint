tern.lint
=========

[![Build Status](https://secure.travis-ci.org/angelozerr/tern.lint.png)](http://travis-ci.org/angelozerr/tern.lint)

**tern.lint** provides :

 * the tern lint plugin `lint.js` to validate JS files.
 * the CodeMirror lint addon `tern-lint.js` which uses tern lint plugin `lint.js`

Here a screenshot with tern lint and CodeMirror :

![CodeMirror & TernLint](https://github.com/angelozerr/tern.lint/wiki/images/CodeMirrorAddon_TernLintOverview.png)

If you are Eclipse user, you can use this tern lint addon too.

## Features

Today tern lint is very basic : 

 * validate property.
 
Any contribution are welcome!

## Structure

The basic structure of the project is given in the following way:

* `demos/` demos with tern lint plugin which use CodeMirror.
* `codemirror/` contains the CodeMirror lint addon `tern-lint.js`, which is an implementation of CodeMirror lint addon with tern.lint.
* `plugin/` contains the tern lint plugin `lint.js`
