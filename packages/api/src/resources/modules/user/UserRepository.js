import debug from '../../../debug/index.js';

class UserRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`UserRepository.js: Erro ao criar usuário: ${error.message}`);
    }
  }

  async login(username, password) {
    try {
      debug.logger.info(`UserRepository: Entrando no método de login do UserRepository.js`);
      debug.logger.info(`UserRepository: Delegando login para camada de modelo`);
      return await this.model.login(username, password);
    } catch (error) {
      debug.logger.warn(`UserRepository: Falha ao delegar login para a camada de modelo `);
      if (error.status === 401) {
        throw { status: 401, message: error.message };
      }
      throw error;
    }
  }
}

export default UserRepository;
