import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bodyParserXml from 'body-parser-xml';
import router from './routes';
import path from 'path';

bodyParserXml(bodyParser);

const app = express();
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.xml());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../build')));
app.use('/', router);

mongoose.connect('mongodb://root:parserffxiv@ds113606.mlab.com:13606/parser-db');
export const db = mongoose.connection;


db.on('error', () => console.log('connection error: '));
db.once('open', () => { console.log('connected to db') });



app.listen(process.env.PORT || 5000, () => console.log('5000'));