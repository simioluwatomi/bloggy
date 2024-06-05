const { scrypt, randomBytes, timingSafeEqual } = require('node:crypto')

const keyLength = 64;

/**
 * Hash a password or a secret with a password hashing algorithm (scrypt)
 * @param {string} password
 * 
 * @returns {string} The hashed password
 */
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        /**
         * Generate a unique salt
         * 
         * @link https://nodejs.org/docs/latest-v20.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
         */
        const salt = randomBytes(16).toString("hex");

        scrypt(password, salt, keyLength, (error, derivedKey) => {
            if (error) {
                reject(error);
            }

            let hashedPassword = derivedKey.toString("hex")

            resolve(`${salt}.${hashedPassword}`);
        });

    });
};

/**
 * Compare a plain text password with a hashed password
 * 
 * @param {string} password The plain text password
 * @param {string} hash The hashed password to check against
 * 
 * @returns {boolean}
 */
async function compareHash(password, hash) {
    return new Promise((resolve, reject) => {

        const [salt, hashKey] = hash.split(".");

        const buffer = Buffer.from(hashKey, "hex");

        scrypt(password, salt, keyLength, (error, derivedKey) => {
            if (error) {
                reject(err)
            };

            resolve(timingSafeEqual(buffer, derivedKey));
        });
    });
};

module.exports = {
    hashPassword,
    compareHash
}