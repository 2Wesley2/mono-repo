import bcrypt from 'bcryptjs';
import passwordValidate from '../../../../../application/services/validators/PasswordValidator.js';

class BcryptService {
  static async hash(password) {
    const validPassword = passwordValidate.validateDataType(password);
    if (!validPassword) {
      throw new Error('Verifique os tipos e comprimentos das strings de senha antes de fazer o hash');
    }
    return await bcrypt.hash(password, 12);
  }

  static async compare(password, hashedPassword) {
    const validPasswords = passwordValidate.validateDataType([password, hashedPassword]);
    if (!validPasswords) {
      throw new Error('Verifique os tipos e comprimentos das strings de senha antes de compara-las');
    }
    return await bcrypt.compare(password, hashedPassword);
  }
}

export default {
  hash: (...args) => BcryptService.hash(...args),
  compare: (...args) => BcryptService.compare(...args),
};
