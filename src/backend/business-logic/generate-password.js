import * as bcrypt from 'bcrypt';
export function generatePasswordFactory(secret, salt) {
    return async function generatePassword(id) {
        const plainTextPassword = `${id}${secret}`;
        // max password allowed length is 15
        const password = (await bcrypt.hash(plainTextPassword, salt)).replace(salt, '').substr(0, 15);
        return password;
    };
}
