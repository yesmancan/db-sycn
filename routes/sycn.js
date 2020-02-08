const router = require('express').Router();
const sql = require('mssql')

const { verify, verifySession } = require('../modules/verifyToken');
const { gettableandcolumnlist } = require('../modules/queries');
const Database = require('../models/Database')

router.get('/', verifySession, async (req, res) => {
    const databases = await Database.find({ status: 1 });
    try {
        const results = { 'results': (databases) ? databases : null };
        res.render('pages/views-db/sycn', results);
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

module.exports = router;