import auth from '../../../../core/adapters/auth/index.js';
import { UnauthorizedError } from '../../../../errors/Exceptions.js';
import { isString } from '../../../../helpers/stringHelper.js';

export default class UserService {
  constructor(repository) {
    this.repository = repository;
  }
  async login(credentials) {
    const userAuth = await this.repository.login({ ...credentials });
    if (!userAuth) {
      throw new UnauthorizedError();
    }
    const { password } = credentials;
    const payloadValues = isString([userAuth._id, userAuth.role]);
    const payload = { id: payloadValues.id, role: payloadValues.role };
    const setPayload = auth.authentication.generateToken(payload);
    return setPayload;
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
