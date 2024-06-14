const ULID = require('ulid')
const jwt = require('jsonwebtoken');
const { addSeconds, getTime, format, formatISO, parseISO, isPast } = require('date-fns');
const database = require('../../config/database');
const { hashPassword, compareHash, generateOTP } = require('./../utilities/hash')
const ResourceExists = require('../errors/ResourceExisits');
const AuthenticationError = require('./../errors/AuthenticationError');
const NotFound = require('./../errors/NotFound');

const transporter = require('../../config/mail');
const { randomInt, randomBytes } = require('node:crypto')

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

async function initiatePasswordReset(usernameOrEmail) {
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
        throw new NotFound('User credentials do not match our records')
    }

    const oneTimePasswordsCollection = await database.connect('one_time_passwords')

    await oneTimePasswordsCollection.deleteMany({ 'user_id': user.id });

    const expiryDate = addSeconds(new Date(), (15 * 60));

    let token, duplicates;

    do {
        token = randomBytes(32).toString('hex');

        duplicates = await oneTimePasswordsCollection.countDocuments({ 'token': token})
    } while (duplicates > 0);

    await oneTimePasswordsCollection.insertOne({
        id: ULID.ulid(),
        user_id: user.id,
        token: token,
        expires_at: formatISO(expiryDate),
    });

    let link = process.env.FE_APP_URL + `/reset-password/${token}`;
    
    // send an email containing OTP
    try {
        await transporter.sendMail({
            from: process.env.MAIL_SECURITY_FROM,
            to: user.email,
            subject: "Password Reset Infitiated",
            text: `We received a request to initiate password reset for your account. Click the link to continue: ${link}`,
        });
    } catch (error) {
    }

    return {
        message: `You will receive an email with password reset instructions if an account is found for: ${usernameOrEmail}`
    };
}

async function resetPassword(token, password) {
    const oneTimePasswordsCollection = await database.connect('one_time_passwords')

    const otp = await oneTimePasswordsCollection.findOne({ 'token': token });

    if (otp === null) {
        throw new NotFound('Invalid OTP provided')
    }

    let parsedDate = parseISO(otp.expires_at);

    if (isPast(parsedDate)) {
        oneTimePasswordsCollection.deleteOne({ 'id' : otp.id });

        throw Error('OTP has expired')
    }

    const usersCollection = await database.connect('users');

    const hashedPassword = await hashPassword(password);

    await usersCollection.findOneAndUpdate(
        { 'id': token.user_id },
        { $set: { "password" : hashedPassword } }
    );

    return {
        message: 'Password reset successful'
    };
}

module.exports = {
    registerUser,
    login,
    initiatePasswordReset,
    resetPassword
}