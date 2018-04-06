'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _bodyParserXml = require('body-parser-xml');

var _bodyParserXml2 = _interopRequireDefault(_bodyParserXml);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _passport3 = require('./passport.js');

var strat = _interopRequireWildcard(_passport3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

(0, _bodyParserXml2.default)(_bodyParser2.default);

var app = (0, _express2.default)();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(_bodyParser2.default.xml());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, '../build')));
app.use('/', _routes2.default);
app.use((0, _morgan2.default)('dev'));
//app.use(passport.initialize());


var db = exports.db = _mongoose2.default.connect(process.env.PARSE_DB, { useMongoClient: true });

db.on('error', function (err) {
  console.log('connection error: ' + err);
});
db.once('open', function () {
  console.log('connected to db');
});

app.listen(process.env.PORT || 5000, function () {
  return console.log('5000');
});