import * as bcrypt from 'bcrypt';
export function generatePasswordFactory(secretsService) {
    return async function generatePassword(id) {
        const { passwordSalt, passwordSecret } = await secretsService.getSecrets();
        const plainTextPassword = `${id}${passwordSecret}`;
        // max password allowed length is 15
        const password = (await bcrypt.hash(plainTextPassword, passwordSalt))
            .replace(passwordSalt, '')
            .substr(0, 15);
        return password;
    };
}
