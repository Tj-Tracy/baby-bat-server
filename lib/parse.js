import mongoose from 'mongoose';

const parseSchema = mongoose.Schema({
    id: String,
    uploadTime:  String,
    raw: String,
    title: String
});

const DpsParse = mongoose.model('DpsParse', parseSchema);

export default DpsParse;