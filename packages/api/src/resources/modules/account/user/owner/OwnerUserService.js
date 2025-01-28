import { UnauthorizedError } from '#src/errors/Exceptions.js';

export default class OwnerUserService {
  constructor(repository) {
    this.repository = repository;
  }

  async signUp(userData) {
    return await this.repository.signUp(userData);
  }

  async login(credentials) {
    const authToken = await this.repository.login(credentials);
    if (!authToken) {
      throw new UnauthorizedError();
    }
    return authToken;
  }
  async getRoleByUser(userID) {
    try {
      return await this.repository.getRoleByUser(userID);
    } catch (error) {
      throw error;
    }
  }
}
