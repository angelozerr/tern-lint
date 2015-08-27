var util = require("./util");

var IGNORE_UNUSED_VAR = {"rules" : {"UnusedVariable" : {"severity" : "none"}}};

exports['test issue36'] = function() {
    // String#replace waits String.prototype|RegExp.prototype
    util.assertLint("var s = '';\ns.replace(10", {
        messages : [{"message":"Invalid argument at 1: cannot convert from number to string|RegExp",
          "from":22,
          "to":24,
          "severity":"error",
          "file":"test1.js"}]
    }, [ "ecma5" ], null, IGNORE_UNUSED_VAR);
}


exports['test Inheritance Types'] = function() {
  // https://github.com/angelozerr/tern-lint/issues/50
  util.assertLint(
      "function Person(name) {\n"
      +"  this.name = name;\n"
      +"}\n"
      +"\n"
      +"function Employee(name, title) {\n"
      +"  this.constructor(name);\n"
      +"  this.title = title;\n"
      +"}\n"
      +"\n"
      +"Employee.prototype = new Person();\n"
      +"Employee.prototype.constructor = Person;\n"
      +"\n"
      +"function Customer(name) {\n"
      +"  this.constructor(name);\n"
      +"}\n"
      +"\n"
      +"Customer.prototype = new Person();\n"
      +"Customer.prototype.constructor = Person;\n"
      +"\n"
      +"\n"
      +"function createSomebody(numb) {\n"
      +"  if (numb % 2 === 1) {\n"
      +"    return new Employee('me', 'worker');\n"
      +"  } else {\n"
      +"    return new Customer('notMe');\n"
      +"  }\n"
      +"}\n"
      +"\n"
      +"alert(createSomebody(2)); ", {
        messages : [{
          "message" : "Invalid argument at 1: cannot convert from Employee|Customer to string",
          "from" : 496,
          "to" : 510,
          "severity" : "error",
          "file": "test1.js"
        }]
      }, [ "browser" ]);
}