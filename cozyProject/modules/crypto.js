const crypto = require('crypto');
const pbkdf2 = require('pbkdf2');
//비밀번호 해쉬함수와 salt 이용해서 탈취되지 않도록 하는 목적

module.exports = {
    encrypt: async (password) => {
        return new Promise(async (resolve, reject) => {
            try {
                const salt = (await crypto.randomBytes(32)).toString('hex');
                pbkdf2.pbkdf2(password, salt.toString(), 1, 32, 'sha512', (err, derivedKey) => {
                    if(err) throw err;
                    const hashed = derivedKey.toString('hex');
                    resolve({salt,hashed});
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    },
    encryptWithSalt: async (password, salt) => {
        return new Promise(async (resolve, reject) => {
            try {
                pbkdf2.pbkdf2(password, salt, 1, 32, 'sha512', (err, derivedKey) => {
                    if(err) throw err;
                    const hashed = derivedKey.toString('hex');
                    resolve(hashed);
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }
}