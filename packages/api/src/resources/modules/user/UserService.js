import { UnauthorizedError } from '../../../errors/Exceptions.js';
class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  async getRoleByUser(userID) {
    try {
      return await this.repository.getRoleByUser(userID);
    } catch (error) {
      throw error;
    }
  }

  async createUser(data) {
    try {
      if (!data.username || !data.password) {
        throw new Error('Username e password são obrigatórios');
      }

      const user = await this.repository.createUser(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByUsername(username) {
    const user = await this.repository.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedError();
    }
    return user;
  }
}
export default UserService;
