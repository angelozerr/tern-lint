tern.lint
=========

[![Build Status](https://secure.travis-ci.org/angelozerr/tern.lint.png)](http://travis-ci.org/angelozerr/tern.lint)

**tern.lint** is a [Tern plugin](http://ternjs.net/doc/manual.html#plugins) to validate JS files.

## Structure

The basic structure of the project is given in the following way:

* `demos/` demos with tern lint plugin which use CodeMirror.
* `codemirror/` contains the CodeMirror lint addon `tern-lint.js`, which is an implementation of CodeMirror lint addon with tern.lint.
* `plugin/` contains the tern lint plugin `lint.js`
