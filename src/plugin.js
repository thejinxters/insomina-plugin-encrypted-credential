const CredentialFile = require("./credential-file");

const TemporaryPasswordStore = {
    fieldName: "credentialKeyInformation",
    setCredentialKeyInfo(credentialKeyInfo) {
        localStorage.removeItem(this.fieldName);
        localStorage.setItem(this.fieldName, JSON.stringify(credentialKeyInfo));
    },
    getAndRemoveCredentialKeyInfo() {
        let credentialKeyInfo = localStorage.getItem(this.fieldName);
        localStorage.removeItem(this.fieldName);
        return JSON.parse(credentialKeyInfo);
    }
};

const Auth = {
    BASIC: "basic",
    BEARER: "bearer",
    OTHER: "other"
};

function determineAuthType(authentication) {
    switch (authentication.type) {
        case Auth.BASIC:
        case Auth.BEARER:
            return authentication.type;
        default:
            return Auth.OTHER;
    }
}

module.exports.templateTags = [{
    name: 'credential',
    displayName: 'Credential',
    description: 'Retrieve Production Password',
    preview: false,
    args: [
        {
            displayName: 'Create new credential on next "send"',
            type: 'boolean',
            defaultValue: false
        }
    ],
    async run(context, promptForPasswordString) {
        let promptForPassword = (promptForPasswordString === 'true' || promptForPasswordString === true);
        let credentialPromptValue;
        let environmentName = context.context.environmentName;
        let credential;

        let request = await context.util.models.request.getById(context.meta.requestId);
        let authType = determineAuthType(request.authentication);
        let credentialKey = context.meta.workspaceId + "_" + environmentName + "_" + authType;

        TemporaryPasswordStore.setCredentialKeyInfo({
            key: credentialKey,
            authType: authType,
            username: request.authentication.username
        });

        if (CredentialFile.exists()) {
            credential = CredentialFile.fetchCredential(credentialKey);
        } else {
            CredentialFile.createFile();
        }

        if (typeof environmentName === 'undefined') {
            throw "Error: Environment Variable `environmentName` must be defined"
        }


        if (promptForPassword || credential === undefined) {
            credentialPromptValue = await context.app.prompt('Credential for environment ' + environmentName, {
                inputType: 'password'
            });

            if (credentialPromptValue === undefined || credentialPromptValue === '') {
                throw new Error("Insomnia will prompt you for a credential on send");
            }

            CredentialFile.addCredential(credentialKey, credentialPromptValue);
            credential = credentialPromptValue;
        }

        return "Credential already stored and ready to use";
    }
}];

module.exports.requestHooks = [
    context => {
        try {
            let credentialKey = TemporaryPasswordStore.getAndRemoveCredentialKeyInfo();
            if (credentialKey !== null ){
                let cred = CredentialFile.fetchCredential(credentialKey.key);
                switch (credentialKey.authType) {
                    case Auth.BASIC:
                        let basicCred = btoa(credentialKey.username + ":" + cred);
                        context.request.removeHeader("Authorization");
                        context.request.addHeader("Authorization", "Basic " + basicCred);
                        break;
                    case Auth.BEARER:
                        context.request.removeHeader("Authorization");
                        context.request.addHeader("Authorization", "Bearer " + cred);
                        break;
                    default:
                        console.log("Not adding authorization type")
                }
            }
        } catch (e) {
            console.log("Error sending request: " + e);
            throw e;
        }
    }
];
