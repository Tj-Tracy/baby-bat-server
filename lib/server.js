import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import router from './routes';
import path from 'path';
import morgan from 'morgan';
import passport from 'passport';
import de from 'dotenv';
import * as strat from './passport.js';

de.config();

bodyParserXml(bodyParser);

const app = express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.xml());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../build')));
app.use('/', router);
app.use(morgan('dev'));
app.use(passport.initialize());
//passport.use('authStrat', strat); 

export const db = mongoose.connect(process.env.PARSE_DB, { useMongoClient: true });

db.on('error', (err) => console.log('connection error: ' + err));
db.once('open', () => { console.log('connected to db') });


app.listen(process.env.PORT || 5000, () => console.log('5000'));