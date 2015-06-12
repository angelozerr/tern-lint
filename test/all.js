exports['test invalid arguments validation'] = require('./validate_argument');
exports['test invalid object literal properties validation'] = require('./validate_property_objl');
exports['test unknown property/identifier validation'] = require('./validate_unknown');
exports['test unused variable/function validation'] = require('./validate_unused');
exports['test RegExp validation'] = require('./validate_regexp');
exports['test full validation'] = require('./validate_full');

if (require.main === module) require("test").run(exports);