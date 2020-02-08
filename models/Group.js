const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    dbName: {
        type: String,
        require: true
    },
    dbType: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 1,
        require: true
    }
});

module.exports = mongoose.model('Group', groupSchema)