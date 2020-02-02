const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const databaseSchema = new Schema({
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
    DatabaseConfig: {
        user: {
            type: String,
            default: '...'
        },
        password: {
            type: String,
            default: '...'
        },
        server: {
            type: String,
            default: Date.now
        },
        database: {
            type: String,
            require: true
        }
    },
    Tables: [
        {
            schema_name: {
                type: String,
                require: true
            },
            table_name: {
                type: String,
                require: true
            },
            columns: [{
                column_id: {
                    type: String,
                    require: true
                },
                column_name: {
                    type: String,
                    require: true
                },
                data_type: {
                    type: String,
                    require: true
                },
                max_length: {
                    type: String,
                    require: true
                },
                precision: {
                    type: String,
                    require: true
                }
            }]
        }
    ],
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

module.exports = mongoose.model('Database', databaseSchema)