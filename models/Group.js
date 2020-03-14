const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    dbIds: {
        type: [Schema.Types.String],
        require: true
    },
    groupName: {
        type: Schema.Types.String,
        require: [true, 'Name is required'],
        minlength: 1
    },
    date: {
        type: Schema.Types.Date,
        default: Date.now
    },
    lastUpdate: {
        type: Schema.Types.Date,
        default: Date.now
    },
    status: {
        type: Schema.Types.Number,
        default: 1,
        require: true
    }
});

function isMyFieldRequired() {
    return typeof this.myField === 'string' ? false : true
}

module.exports = mongoose.model('Group', groupSchema)