Insomina Encrypted Credentials Plugin
=====================================

The `Insomina Encrypted Credentials Plugin` allows users to store their passwords in an encrypted
file rather than storing them in plain text inside an environment. It uses crypto-js to generate
a crypto key, and stores the encrypted passwords in `~/.insomina/insomina.creds`

## install

**Via Insomnia**

Under `Preferences > Plugins` install using the following npm-package-name:
```
insomnia-plugin-encrypted-credentials
```


**Manual Install**

```bash
cd ~/Library/Application\ Support/Insomia/pugins
git clone https://github.com/thejinxters/insomina-plugin-encrypted-credentials.git
```

## use

Once the plugin has been installed, you can use the plugin to store credentials for both `Basic
Auth` and `Bearer Token` Authentication.

For _basic auth_:
Use the keyword `Credential` in the password field instead of typing in a password.

![Basic auth example](https://raw.githubusercontent.com/thejinxters/insomina-plugin-encrypted-credential/master/docs/img/basic-auth.png)

For _bearer token auth_:
Use the keyword `Credential` in the token field instead of typing in a bearer token

![Bearer token example](https://raw.githubusercontent.com/thejinxters/insomina-plugin-encrypted-credential/master/docs/img/bearer-auth.png)

When making a request for the first time, the plugin will prompt you to enter in your desired
credential. This credential will be stored in an encrypted file for future use.

The Encrypted Credentials Plugin will store one password for each combination of the following
variables:
 - Workspace
 - Environment
 - Authentication Type (bearer/basic)
 
To re-enter a credential, click on `Credential` and select `Create new credential on next "send"`.
This will prompt you to renter your password. 

![Settings example](https://raw.githubusercontent.com/thejinxters/insomina-plugin-encrypted-credential/master/docs/img/settings.png)

Uncheck this box after you have successfully sent
a request to use the stored password.


## license

MIT
