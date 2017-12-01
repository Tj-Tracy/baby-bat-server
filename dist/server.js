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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bodyParserXml2.default)(_bodyParser2.default);

var app = (0, _express2.default)();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(_bodyParser2.default.xml());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, '../../build')));
app.use('/', _routes2.default);

_mongoose2.default.connect('mongodb://root:parserffxiv@ds113606.mlab.com:13606/parser-db');
var db = exports.db = _mongoose2.default.connection;

db.on('error', function () {
  return console.log('connection error: ');
});
db.once('open', function () {
  console.log('connected to db');
});

app.listen(process.env.PORT || 5000, function () {
  return console.log('5000');
});