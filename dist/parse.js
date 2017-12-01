'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseSchema = _mongoose2.default.Schema({
    id: String,
    uploadTime: String,
    raw: String,
    title: String
});

var DpsParse = _mongoose2.default.model('DpsParse', parseSchema);

exports.default = DpsParse;