import Auth from '../services/auth/index.js';
import { UnauthorizedError } from '../errors/Exceptions.js';

export default class AuthMiddleware extends Auth {
  async authenticate({ password, userPasswordHashed, payload }) {
    const service = this.authenticationService;
    const validatedPassword = await service.validatePassword(password, userPasswordHashed);
    if (!validatedPassword) {
      throw new UnauthorizedError();
    }
    const generatedToken = await service.generateToken(payload);
    return generatedToken;
  }

  async isAuthenticate(token) {
    const service = super.authenticationService;
    const isAuth = await service.verifyToken(token);
    if (!isAuth) {
      throw new UnauthorizedError();
    }
    return true;
  }
}
