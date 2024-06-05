const { generateKeyPair } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const FilesystemError = require('../errors/FilesystemError');

/**
 * Generate a public and private key-pair used to sign and verify JWTs.
 * 
 * @param {boolean} forceWrite
 */
async function generateKeys(forceWrite = false) {
    const baseDirectory = 'storage/keys';
    const keyType = process.env.JWT_KEY_TYPE ?? 'rsa';
    const publicKeyFilename = path.resolve(baseDirectory, process.env.JWT_PUBLIC_KEY);
    const privateKeyFilename = path.resolve(baseDirectory, process.env.JWT_PRIVATE_KEY);

    const options = {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'spki', format: 'pem'},
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    };

    // Check if key files exist
    if (! forceWrite) {
        try {
            await fs.access(publicKeyFilename, fs.constants.R_OK);

            await fs.access(privateKeyFilename, fs.constants.R_OK);

            throw new FilesystemError('A JWT key-pair already exists; use the force flag to overwrite them');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }

    // Ensure the directory exists before writing to it
    await fs.mkdir(path.resolve(baseDirectory), { recursive: true });

    return new Promise((resolve, reject) => {
        generateKeyPair(keyType, options, async (error, publicKey, privateKey) => {
            if (error) {
                let customError = new FilesystemError('JWT key generation failed');

                reject(customError);
            }

            try {
                await fs.writeFile(publicKeyFilename, publicKey);
                

                await fs.writeFile(privateKeyFilename, privateKey);

                resolve();
            } catch (error) {
                let customError = new FilesystemError('JWT key-pair could not be written to disk');

                reject(customError);
            }
        });
    });
}

module.exports = {
    generateKeys,
}