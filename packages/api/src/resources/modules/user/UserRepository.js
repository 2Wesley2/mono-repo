import debug from '../../../debug/index.js';

class UserRepository {
  constructor(model) {
    this.model = model;
  }

  async getRoleByUser(userID) {
    try {
      return await this.model.getRoleByUser(userID);
    } catch (error) {
      throw error;
    }
  }

  async createUser(data) {
    try {
      return await this.model.createUser(data);
    } catch (error) {
      throw new Error(`UserRepository.js: Erro ao criar usuário: ${error.message}`);
    }
  }

  async getUserByUsername(username) {
    return await this.model.getUserByUsername(username);
  }
}

export default UserRepository;
