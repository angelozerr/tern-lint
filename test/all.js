exports['test invalid arguments validation'] = require('./validate_argument');
exports['test invalid object literal properties validation'] = require('./validate_property_objl');
exports['test unknown property/identifier validation'] = require('./validate_unknown');
exports['test unused variable/function validation'] = require('./validate_unused');
exports['test RegExp validation'] = require('./validate_regexp');
exports['test multiple types validation'] = require('./validate_multitypes');

// JSDoc
//exports['test Assignmement JSDoc validation'] = require('./validate_assignmement_jsdoc');
exports['test Argument JSDoc validation'] = require('./jsdoc/validate_assignmement.js');
exports['test Array JSDoc validation'] = require('./jsdoc/array.js');
exports['test Returns JSDoc validation'] = require('./jsdoc/returns.js');

// RequireJS
exports['test RequireJS config validation'] = require('./requirejs/validate_config');

// ES6
exports['test ES6 let validation'] = require('./es6/let');
exports['test ES6 modules validation'] = require('./es6/es_modules');

// Full validation
exports['test full validation'] = require('./validate_full');

if (require.main === module) require("test").run(exports);