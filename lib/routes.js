import express from "express";
import DpsParse from "./parse.js";
import path from "path";
import * as parser from "xml2json";
import User from "./user.js";
import jwt from "jsonwebtoken";
import env from 'dotenv';
import passport from 'passport';
import strategy from './passport';



env.config();

const router = express.Router();
router.use(passport.initialize());  
//And now we can import our JWT passport strategy. Enter this below our mongoose connection:

// Bring in defined Passport Strategy
require('./passport')(passport);  

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.get("/api/parseList", (req, res) => {
  res.set("Content-type", "application/json");
  DpsParse.find({}, "id uploadTime title", (err, dpsParse) => {
    if (err) {
      console.log(`Something went wrong: ${err}`);
      res.send(`{"success": "false", "code": "02, couldn't find anything"}`);
    } else {
      res.write("[");
      dpsParse.map((currentParse, i) => {
        res.write(`{
          "uploadTime": "${currentParse.uploadTime}",
          "id": "${currentParse.id}",
          "title": "${currentParse.title}"
        }`);
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
router.post("/api/submitParse", (req, res) => {
  // create the object to save to mongo
  if (req.body.raw) {
    let parsedRaw = JSON.parse(parser.toJson(req.body.raw));
    const d = new Date();
    const newDpsParse = new DpsParse({
      id: parsedRaw.EncounterTable.Row[0].EncId,
      uploadTime: `${d.toLocaleDateString()}`,
      raw: JSON.stringify(parsedRaw),
      title: req.body.title
    });
    // save it to the db
    newDpsParse.save(err => {
      if (err) {
        console.log("Something went wrong saving to db: ", err);
      }
    });
    // return results
    res.send(JSON.stringify(newDpsParse));
  } else {
    res.send(`{"success": "false", "code": "01, no body"}`);
  }
});

router.get("/api/parse/:id", (req, res) => {
  res.set("Content-type", "application/json");
  DpsParse.findOne(
    {
      id: req.params.id
    },
    (err, dpsParse) => {
      if (err) {
        res.send(`{"success": "false", "code": "01, no parse here"}`);
      } else {
        res.send(dpsParse);
      }
    }
  );
});

router.get("/parse/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

router.post("/register", (req, res) => {
  console.log(req.body);
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save(err => {
    console.log(err);
    if (err) return res.json({ success: false, reason: err });
    return res.json({ success: true });
  });
});

router.post("/login", (req, res) => {
  User.find({username: req.body.username}, 'username password', (err, user) => {
      if (!user) {
        return res.json({ success: false, reason: "no user" });
      }
      user[0].comparePassword(req.body.password, (err, match) => {
        if (match) {
          const token = jwt.sign(JSON.stringify(user), process.env.SECRET);
          return res.json({ success: true, jwtToken: token });
        } else {
          return res.json({ success: false, reason: "auth failed" });
        }
      });
    }
    
  );
});

router.get("/api/whois", passport.authenticate('jwt', { session: false }), (req, res) => {  
  return res.json({username: req.user.username});
});

export default router;
