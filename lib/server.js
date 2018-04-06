import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import router from './routes';
import path from 'path';
<<<<<<< HEAD
import morgan from 'morgan';
import passport from 'passport';
import de from 'dotenv';
import * as strat from './passport.js';

de.config();
=======
>>>>>>> 02aa6f2ddf7c6acb2c01886779abb0fdd359448d

bodyParserXml(bodyParser);

const app = express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.xml());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../build')));
app.use('/', router);
<<<<<<< HEAD
app.use(morgan('dev'));
//app.use(passport.initialize());


export const db = mongoose.connect(process.env.PARSE_DB, { useMongoClient: true });

db.on('error', (err) => {console.log('connection error: ' + err)});
db.once('open', () => { console.log('connected to db') });


=======

mongoose.connect('mongodb://root:parserffxiv@ds113606.mlab.com:13606/parser-db', { useMongoClient: true });
export const db = mongoose.connection;


db.on('error', () => console.log('connection error: '));
db.once('open', () => { console.log('connected to db') });



>>>>>>> 02aa6f2ddf7c6acb2c01886779abb0fdd359448d
app.listen(process.env.PORT || 5000, () => console.log('5000'));