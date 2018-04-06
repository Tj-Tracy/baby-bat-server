import mongoose from 'mongoose';
import * as database from './server.js';


const parseSchema = mongoose.Schema({
    id: String,
    uploadTime:  String,
    raw: String,
    title: String
});

const DpsParse = mongoose.model('DpsParse', parseSchema);

export default DpsParse;