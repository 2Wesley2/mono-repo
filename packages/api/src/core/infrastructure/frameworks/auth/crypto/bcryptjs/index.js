import bcrypt from 'bcryptjs';
import { isString } from '../../../../../../helpers/stringHelper.js';

/**
 * Interface para o serviço de hashing e validação de senhas utilizando bcryptjs.
 */
class BcryptService {
  static async hash(password) {
    if (!isString(password)) {
      throw new Error('Verifique os tipos e comprimentos das strings de senha antes de fazer o hash');
    }
    try {
      return await bcrypt.hash(password, 12);
    } catch (error) {
      console.error('Erro ao gerar o hash da senha:', error.message);
      throw new Error('Erro interno ao processar a senha.');
    }
  }

  static async compare(password, hashedPassword) {
    if (!isString([password, hashedPassword])) {
      throw new Error('Verifique os tipos e comprimentos das strings de senha antes de compara-las');
    }
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Erro ao validar a senha:', error.message);
      throw new Error('Erro interno ao validar a senha.');
    }
  }
}

export default {
  hash: (...args) => BcryptService.hash(...args),
  compare: (...args) => BcryptService.compare(...args),
};
