const router = require('express').Router();
const sql = require('mssql')

const { verify, verifySession } = require('../modules/verifyToken');
const { gettableandcolumnlist } = require('../modules/queries');
const Database = require('../models/Database')

router.get('/', verifySession, async (req, res) => {
    const databases = await Database.find({ status: 1 }).select('-Tables');

    try {
        const results = { 'results': (databases) ? databases : null };
        res.render('pages/views-db/index', results);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

router.get('/:dbId', async (req, res) => {
    const database = await Database.find({ _id: req.params.dbId, status: 1 });
    try {
        const results = { 'results': (database) ? database : null };
        res.render('pages/views-db/detail', results);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

router.get('/api/dbs/', verifySession, async (req, res) => {
    //Get Select Element
    const databases = await Database.find({ status: 1 }).select('dbName dbType');
    try {
        res.json(databases);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


router.post('/api/init/:dbId', async (req, res) => {
    let database = await Database.findOne({ _id: req.params.dbId, status: 1 });
    try {
        const result = await GetTableList(database.DatabaseConfig);
        database = await ReLoadTable(result, database);

        Database.updateOne({ _id: req.params.dbId, status: 1 }, database, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send(result);
        });

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

router.post('/api/add', async (req, res) => {
    const database = new Database({
        dbName: req.body.dbName,
        dbType: req.body.dbType,
        DatabaseConfig: {
            user: req.body.dbConnectionString_user,
            password: req.body.dbConnectionString_password,
            server: req.body.dbConnectionString_server,
            database: req.body.dbConnectionString_database,
        }
    });

    try {
        const savedDatabase = await database.save();
        res.json(savedDatabase);
    } catch (err) {
        res.status(400).send(err);
    }
});
router.post('/api/update/:dbId', async (req, res) => {
    let database = await Database.findOne({ _id: req.params.dbId, status: 1 });
    try {
        database.dbName = req.body.dbName;
        database.dbType = req.body.dbType;
        database.DatabaseConfig.user = req.body.dbConnectionString_user;
        database.DatabaseConfig.password = req.body.dbConnectionString_password;
        database.DatabaseConfig.server = req.body.dbConnectionString_server;
        database.DatabaseConfig.database = req.body.dbConnectionString_database;

        Database.updateOne({ _id: req.params.dbId, status: 1 }, database, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send(doc);
        });

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});
router.post('/api/delete/:dbId', async (req, res) => {
    try {
        const query = { _id: req.params.dbId };
        const db = await Database.findOne(query, (err, doc) => {
            if (err) res.status(400).send(err);

            doc.status = -1;
            doc.dbName = "Hoyda";
            doc.lastUpdate = Date.now();
            doc.save();
        })

        res.json(db);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});


const GetTableList = async (config) => {
    try {
        await sql.connect({
            user: config.user,
            password: config.password,
            server: config.server,
            database: config.database,
            options: {
                enableArithAbort: true,
                tedious: true
            }
        });

        return (await sql.query(gettableandcolumnlist)).recordset;
    } catch (err) {
        console.log(err);
        return err;
    }
}

const ReLoadTable = async (result, database) => {
    database.Tables = [];
    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        const table = database.Tables.filter(x => x.schema_name === element.schema_name && x.table_name === element.table_name);
        if (table === null || table.length === 0) {
            const _table = {
                schema_name: element.schema_name,
                table_name: element.table_name,
                columns: [{
                    column_id: element.column_id,
                    column_name: element.column_name,
                    column_isnull: element.column_isnull,
                    column_lenght: element.column_lenght,
                    data_type: element.data_type,
                    max_length: element.max_length,
                    precision: element.precision,
                    table_create_date: element.table_create_date,
                    table_modify_date: element.table_modify_date
                }]
            }
            database.Tables.push(_table);
        } else {
            table[0].columns.push({
                column_id: element.column_id,
                column_name: element.column_name,
                column_isnull: element.column_isnull,
                column_lenght: element.column_lenght,
                data_type: element.data_type,
                max_length: element.max_length,
                precision: element.precision,
                table_create_date: element.table_create_date,
                table_modify_date: element.table_modify_date
            });
        }
    }
    if (database.lastUpdate) {
        database.lastUpdate = (new Date).toLocaleDateString() + ' ' + (new Date).toLocaleTimeString();
        console.log(database.lastUpdate)
    }
    return database;
}
module.exports = router;