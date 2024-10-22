import Repository from '../../core/Repository.js';
import { USER } from '../../constants/index.js';
import debug from '../../../debug/index.js';

class UserRepository extends Repository {
  constructor(model) {
    super(model, USER);
  }

  async create(data) {
    try {
      debug.logger.info('UserRepository.js: criando usuário');
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`UserRepository.js: Erro ao criar usuário: ${error.message}`);
    }
  }

  async login(username, password) {
    try {
      debug.logger.info(`UserRepository: Tentando logar usuário ${username}`);
      return this.model.login(username, password);
    } catch (error) {
      debug.logger.error(`UserRepository: Erro ao logar usuário ${username}. Erro: ${error.message}`);
      throw error;
    }
  }
}

export default UserRepository;
