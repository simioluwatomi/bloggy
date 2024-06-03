const database = require('../../config/database');
const { hashPassword } = require('./../utilities/hash')
const ULID = require('ulid')
const { format } = require('date-fns');
const ResourceExists = require('../errors/ResourceExisits');

async function registerUser(userData) {
    const collection = await database.connect('users');

    const existingUser = await collection.findOne(
        {
            $or: [
                    { username: userData.username },
                    { email: userData.email }
                ]
        }
    )

    if(existingUser) {
        throw new ResourceExists('A user with the provided username or email address exists');
    }
    
    const today = new Date();

    let password = await hashPassword(userData.password)

    const result = await collection.insertOne({
        id: ULID.ulid(),
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        email: userData.email,
        password: password,
        created_at: format(today, 'yyyy-MM-dd'),
    });

    return result;
}

module.exports = {
    registerUser
}