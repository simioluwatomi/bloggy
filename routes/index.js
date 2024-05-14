const express = require('express');
const router = express.Router();
const database = require('../config/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const db = await database;

    const results = await db.collection('bloggy').find({}).toArray()

    res.json(results)

  } catch (error) {
    console.log(`Error querying database: ${error}`);

    res.status(500).json({error: `Internal server error`});
  }
});

module.exports = router;
