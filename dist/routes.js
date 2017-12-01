'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _parse = require('./parse.js');

var _parse2 = _interopRequireDefault(_parse);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _xml2json = require('xml2json');

var parser = _interopRequireWildcard(_xml2json);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '../build', 'index.html'));
});

router.get('/parseList', function (req, res) {
  res.set('Content-type', 'application/json');
  _parse2.default.find({}, "id uploadTime title", function (err, dpsParse) {
    if (err) {
      console.log('Something went wrong: ' + err);
      res.send('{"success": "false", "code": "02, couldn\'t find anything"}');
    } else {
      res.write("[");
      dpsParse.map(function (currentParse, i) {
        res.write('{\n          "uploadTime": "' + currentParse.uploadTime + '",\n          "id": "' + currentParse.id + '",\n          "title": "' + currentParse.title + '"\n        }');
        if (i + 1 !== dpsParse.length) {
          res.write(",");
        }
      });
      res.write("]");
      res.end();
    }
  });
});

// Handle submitting a parse to the database
router.post('/submitParse', function (req, res) {

  // create the object to save to mongo
  if (req.body.raw) {
    var parsedRaw = JSON.parse(parser.toJson(req.body.raw));
    var d = new Date();
    var newDpsParse = new _parse2.default({
      id: parsedRaw.EncounterTable.Row[0].EncId,
      uploadTime: d.getMonth() + '-' + d.getDay() + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes(),
      raw: JSON.stringify(parsedRaw),
      title: req.body.title
    });
    // save it to the db
    newDpsParse.save(function (err) {
      if (err) {
        console.log("Something went wrong saving to db: ", err);
      }
    });
    // return results
    res.send(JSON.stringify(newDpsParse));
  } else {
    res.send('{"success": "false", "code": "01, no body"}');
  }
});

router.get('/parse/:id', function (req, res) {
  res.set('Content-type', 'application/json');
  _parse2.default.findOne({
    id: req.params.id
  }, function (err, dpsParse) {
    if (err) {
      res.send('{"success": "false", "code": "01, no parse here"}');
    } else {
      res.send(dpsParse);
    }
  });
});

exports.default = router;