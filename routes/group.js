const router = require('express').Router();
const sql = require('mssql')
const assert = require('assert').strict;

const { verify, verifySession } = require('../modules/verifyToken');
const { gettableandcolumnlist } = require('../modules/queries');

const Group = require('../models/Group');

router.get('/', verifySession, async (req, res) => {
    const groups = await Group.find({ status: 1 });
    try {
        const results = { 'results': (groups) ? groups : null };
        res.render('pages/views-db/groups', results);
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
    const group = new Group({
        dbIds: req.body.dbIds
    });
    try {
        const savedGroup = await group.save();
        res.json(savedGroup);
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

module.exports = router;