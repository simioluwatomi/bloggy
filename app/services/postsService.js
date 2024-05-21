const database = require('../../config/database');

async function getPosts() {
    const db = await database;

    const results = await db.collection(process.env.DB_DATABASE).find({}).toArray()

    return results;
}

module.exports = {
    getPosts
}