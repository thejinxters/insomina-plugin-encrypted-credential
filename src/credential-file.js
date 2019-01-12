const crypto = require("./crypto");
const fs = require("fs");
const os = require("os");
const username = os.userInfo().username;
const md5Field = "md5";

module.exports = {
    credsFolder: "/Users/" + username + "/.insomnia",
    pathToFile() {
        return this.credsFolder + "/insomnia.creds";
    },
    exists() {
        return fs.existsSync(this.pathToFile());
    },
    clearCredsFile() {
        let json = {};
        json[md5Field] = crypto.md5();
        fs.writeFileSync(this.pathToFile(), JSON.stringify(json));
    },
    createFile() {
        if(!fs.existsSync(this.credsFolder)){
            fs.mkdirSync(this.credsFolder);
        }
        this.clearCredsFile();
    },
    validMd5() {
        return this.readFileAsJson()[md5Field] === crypto.md5();
    },
    readFileAsJson() {
        let fileContents = fs.readFileSync(this.pathToFile(), 'utf8');
        return this.parse(fileContents);
    },
    addCredential(key, password){
        let json = this.readFileAsJson();
        json[key] = crypto.encrypt(password);
        fs.writeFileSync(this.pathToFile(), JSON.stringify(json));
    },
    fetchCredential(key) {
        if (this.validMd5()){
            return crypto.decrypt(this.readFileAsJson()[key]);
        } else {
            this.clearCredsFile();
            return undefined;
        }
    },
    parse(fileContents) {
        return JSON.parse(fileContents);
    }
};
