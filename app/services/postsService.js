const database = require('../../config/database');

async function getPosts() {
    const db = await database;

    return await db.collection(process.env.DB_DATABASE).find({}).toArray()
}

async function getPost(identifier) {
    const db = await database;

    return await db.collection(process.env.DB_DATABASE).find({'id': identifier}).toArray();
}

module.exports = {
    getPosts,
    getPost
}