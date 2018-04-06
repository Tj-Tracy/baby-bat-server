import mongoose from 'mongoose';
<<<<<<< HEAD
import * as database from './server.js';

=======
>>>>>>> 02aa6f2ddf7c6acb2c01886779abb0fdd359448d

const parseSchema = mongoose.Schema({
    id: String,
    uploadTime:  String,
    raw: String,
    title: String
});

const DpsParse = mongoose.model('DpsParse', parseSchema);

export default DpsParse;