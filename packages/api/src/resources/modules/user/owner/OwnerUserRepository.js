import { UnauthorizedError } from '#src/errors/Exceptions.js';
import auth from '#core/adapters/auth/authentication/index.js';
export default class OwnerUserRepository {
  constructor(model) {
    this.model = model;
  }

  async login(credentials) {
    const { username, password } = credentials;
    const user = await this.model.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedError();
    }
    const login = await auth.authenticate(password, user.password);
    if (!login) {
      throw new UnauthorizedError();
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
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
