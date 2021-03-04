import * as bcrypt from 'bcrypt';
import { SecretsService } from '../../services/secrets-service';

export function generatePasswordFactory(secretsService: SecretsService) {
  return async function generatePassword(id: string): Promise<string> {
    const { passwordSalt, passwordSecret } = await secretsService.getSecrets();
    const plainTextPassword = `${id}${passwordSecret}`;
    // max password allowed length is 15
    const password = (await bcrypt.hash(plainTextPassword, passwordSalt))
      .replace(passwordSalt, '')
      .substr(0, 15);
    return password;
  };
}

export type GeneratePassword = ReturnType<typeof generatePasswordFactory>;
