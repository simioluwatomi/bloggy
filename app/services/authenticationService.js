const ULID = require('ulid')
const jwt = require('jsonwebtoken');
const { addSeconds, getTime, format, formatISO } = require('date-fns');
const database = require('../../config/database');
const { hashPassword, compareHash } = require('./../utilities/hash')
const ResourceExists = require('../errors/ResourceExisits');
const AuthenticationError = require('./../errors/AuthenticationError');

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

    if (existingUser) {
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

async function login(usernameOrEmail, password) {
    const collection = await database.connect('users');

    const user = await collection.findOne(
        {
            $or: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail }
                ]
        }
    )

    if (user === null) {
        throw new AuthenticationError('User credentials do not match our records')
    }

    const passwordCompare = await compareHash(password, user.password);

    if (passwordCompare === false) {
        throw new AuthenticationError('User credentials do not match our records')
    }

    const expiryDate = addSeconds(new Date(), process.env.JWT_TOKEN_EXPIRY);

    const token = jwt.sign(
        {
            exp: Math.floor(getTime(expiryDate) / 1000),
            email: user.email,
            username: user.username,
            id: user.id,
        },
        process.env.APP_KEY,
        {
            issuer: process.env.JWT_TOKEN_ISSUER,
            notBefore: '0s'
        }
    );

    return {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            created_at: user.created_at,
        },
        jwt: {
            token: token,
            expires_at: formatISO(expiryDate)
        }
    };
}

module.exports = {
    registerUser,
    login
}