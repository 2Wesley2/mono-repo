import { UnauthorizedError } from '#src/errors/Exceptions.js';
import auth from '#core/adapters/auth/authentication/index.js';
export default class OwnerUserRepository {
  constructor(model) {
    this.model = model;
  }

  async login(credentials) {
    return await this.model.login(credentials);
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
