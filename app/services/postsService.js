const database = require('../../config/database');

async function getPosts() {
    const db = await database;

    const results = await db.collection(process.env.DB_DATABASE).find({}).toArray()

    return results;
}

async function getPost(identifier) {
    const db = await database;

    const result = await db.collection(process.env.DB_DATABASE).find({'id': identifier}).toArray()

    return result;
}

module.exports = {
    getPosts,
    getPost
}