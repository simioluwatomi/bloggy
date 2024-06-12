const crypto = require('node:crypto')
const path = require('node:path');
const fs = require('node:fs')

function encryptWithPublicKey(message) {
    const buffer = Buffer.from(message, 'utf8');
    try {
        const filePath = path.resolve('storage/keys', 'jwt-public.key');

        const publicKey = fs.readFileSync(filePath, { encoding: 'utf8' });

        console.log('encryption starting');
        
        return crypto.publicEncrypt(publicKey, buffer);
    } catch (error) {
        console.log(error);

        return 'encryption failed'
    }

}

function decryptWithPrivatekey(message) {
    try {
        const filePath = path.resolve('storage/keys', 'jwt-private.key');

        const privateKey = fs.readFileSync(filePath, { encoding: 'utf8' });

        console.log('decryption starting');
        
        return crypto.privateDecrypt(privateKey, message);
    } catch (error) {
        console.log(error);

        return 'decryption failed'
    }

}

module.exports = {
    encryptWithPublicKey,
    decryptWithPrivatekey
}