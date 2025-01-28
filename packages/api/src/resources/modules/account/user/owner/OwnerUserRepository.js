import auth from '#core/adapters/auth/index.js';
import { UnauthorizedError } from '#src/errors/Exceptions.js';
import { isString } from '#src/helpers/stringHelper.js';

export default class OwnerUserRepository {
  constructor(model) {
    this.model = model;
  }

  async signUp(userData) {
    return await this.model.signUp(userData);
  }

  async login(credentials) {
    const authenticatedUser = await this.model.login(credentials);
    if (!authenticatedUser) {
      throw new UnauthorizedError();
    }
    const { id, role } = authenticatedUser;
    const userValues = isString([id, role]);
    if (!userValues) {
      throw new TypeError('ID ou role inválidos. Ambos devem ser strings.');
    }
    const tokenPayload = { id, role };
    const authToken = auth.authentication.generateToken(tokenPayload);
    return authToken;
  }
}
