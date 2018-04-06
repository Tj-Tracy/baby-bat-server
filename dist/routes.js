"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _parse = require("./parse.js");

var _parse2 = _interopRequireDefault(_parse);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _xml2json = require("xml2json");

var parser = _interopRequireWildcard(_xml2json);

var _user = require("./user.js");

var _user2 = _interopRequireDefault(_user);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passport3 = require("./passport");

var _passport4 = _interopRequireDefault(_passport3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var router = _express2.default.Router();
router.use(_passport2.default.initialize());
//And now we can import our JWT passport strategy. Enter this below our mongoose connection:

// Bring in defined Passport Strategy
require('./passport')(_passport2.default);

router.get("/", function (req, res) {
  res.sendFile(_path2.default.join(__dirname, "../build", "index.html"));
});

router.get("/api/parseList", function (req, res) {
  res.set("Content-type", "application/json");
  _parse2.default.find({}, "id uploadTime title", function (err, dpsParse) {
    if (err) {
      console.log("Something went wrong: " + err);
      res.send("{\"success\": \"false\", \"code\": \"02, couldn't find anything\"}");
    } else {
      res.write("[");
      dpsParse.map(function (currentParse, i) {
        res.write("{\n          \"uploadTime\": \"" + currentParse.uploadTime + "\",\n          \"id\": \"" + currentParse.id + "\",\n          \"title\": \"" + currentParse.title + "\"\n        }");
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
router.post("/api/submitParse", function (req, res) {
  // create the object to save to mongo
  if (req.body.raw) {
    var parsedRaw = JSON.parse(parser.toJson(req.body.raw));
    var d = new Date();
    var newDpsParse = new _parse2.default({
      id: parsedRaw.EncounterTable.Row[0].EncId,
      uploadTime: "" + d.toLocaleDateString(),
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
    res.send("{\"success\": \"false\", \"code\": \"01, no body\"}");
  }
});

router.get("/api/parse/:id", function (req, res) {
  res.set("Content-type", "application/json");
  _parse2.default.findOne({
    id: req.params.id
  }, function (err, dpsParse) {
    if (err) {
      res.send("{\"success\": \"false\", \"code\": \"01, no parse here\"}");
    } else {
      res.send(dpsParse);
    }
  });
});

router.get("/parse/:id", function (req, res) {
  res.sendFile(_path2.default.join(__dirname, "../build", "index.html"));
});

router.post("/register", function (req, res) {
  console.log(req.body);
  var newUser = new _user2.default({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save(function (err) {
    console.log(err);
    if (err) return res.json({ success: false, reason: err });
    return res.json({ success: true });
  });
});

router.post("/login", function (req, res) {
  _user2.default.find({ username: req.body.username }, 'username password', function (err, user) {
    if (!user) {
      return res.json({ success: false, reason: "no user" });
    }
    user[0].comparePassword(req.body.password, function (err, match) {
      if (match) {
        var token = _jsonwebtoken2.default.sign(JSON.stringify(user), process.env.SECRET);
        return res.json({ success: true, jwtToken: token });
      } else {
        return res.json({ success: false, reason: "auth failed" });
      }
    });
  });
});

router.get("/api/whois", _passport2.default.authenticate('jwt', { session: false }), function (req, res) {
  return res.json({ username: req.user.username });
});

exports.default = router;