const { encryptWithPublicKey, decryptWithPrivatekey } = require("./app/utilities/encrypt");

const encrypted = encryptWithPublicKey('Secret message');

console.log(encrypted.toString());

const decrypted = decryptWithPrivatekey(encrypted);

console.log(decrypted.toString());