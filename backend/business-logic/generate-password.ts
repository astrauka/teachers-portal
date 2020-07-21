import * as bcrypt from 'bcrypt';

export function generatePasswordFactory(secret: string, salt: string) {
  return async function generatePassword(id: string): Promise<string> {
    const plainTextPassword = `${id}${secret}`;
    // max password allowed length is 15
    const password = (await bcrypt.hash(plainTextPassword, salt)).replace(salt, '').substr(0, 15);
    return password;
  };
}

export type GeneratePassword = ReturnType<typeof generatePasswordFactory>;
