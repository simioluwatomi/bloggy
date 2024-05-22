const database = require('../../config/database');

async function getPosts() {
    const collection = await database.connect('posts');

    return await collection.find({}).toArray()
}

async function getPost(identifier) {
    const collection = await database.connect('posts');

    return await collection.find({'id': identifier}).toArray();
}

module.exports = {
    getPosts,
    getPost
}