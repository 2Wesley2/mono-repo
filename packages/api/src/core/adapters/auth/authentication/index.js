import auth from '../../../infrastructure/frameworks/auth/index.js';
import env from '../../../../config/index.js';
import { UnauthorizedError } from '../../../../errors/Exceptions.js';

class Authentication {
  static get #secretKey() {
    return env.jwtSecret;
  }

  static async authenticate(plainPassword, hashedPassword, payload) {
    const validatePassword = await auth.bcryptjs.compare(plainPassword, hashedPassword);
    if (!validatePassword) {
      throw new UnauthorizedError();
    }
    const generateToken = await auth.jsonwebtoken.generate(payload, this.#secretKey);
    return generateToken;
  }

  static async isAuthenticate(token) {
    const isAuth = await auth.jsonwebtoken.verify(token, this.#secretKey);
    return isAuth;
  }

  static decodeToken(token) {
    const decode = auth.jsonwebtoken.decode(token);
    return decode;
  }
}

export default {
  authenticate: (...args) => Authentication.authenticate(...args),
  isAuthenticate: (...args) => Authentication.isAuthenticate(...args),
  decodeToken: (...args) => Authentication.decodeToken(...args),
};
