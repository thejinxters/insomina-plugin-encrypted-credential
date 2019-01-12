const CryptoJS = require("crypto-js");
const fs = require("fs");
const path = require("path");
const keyFilePath = path.resolve(__dirname) + "/crypto.key";

function generateKey() {
	return CryptoJS.lib.WordArray.random(256).toString();
}

function encryptionKey() {
    let key;
    if (fs.existsSync(keyFilePath)){
		return fs.readFileSync(keyFilePath, 'utf8');
	} else {
		key = generateKey();
		fs.writeFileSync(keyFilePath, key);
	}
	return key;
}

module.exports = {
	encrypt(payload) {
		return CryptoJS.AES.encrypt(payload, encryptionKey()).toString();
	},
	decrypt(payload) {
		if (payload === undefined) return undefined;
		return CryptoJS.AES.decrypt(payload, encryptionKey()).toString(CryptoJS.enc.Utf8);
	},
	md5(){
		return CryptoJS.MD5(encryptionKey()).toString();
	}
};
