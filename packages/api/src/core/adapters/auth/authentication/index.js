import auth from '../../../infrastructure/frameworks/auth/index.js';
import env from '../../../../config/index.js';
import { UnauthorizedError } from '../../../../errors/Exceptions.js';

class Authentication {
  static get #secretKey() {
    return env.jwtSecret;
  }

  static async authenticate(credentials) {
    const { password, hashedPassword } = credentials;
    const validatePassword = await auth.bcryptjs.compare(password, hashedPassword);
    if (!validatePassword) {
      throw new UnauthorizedError();
    }
    return validatePassword;
  }

  static async hash(password) {
    return await auth.bcryptjs.hash(password);
  }

  static generateToken(payload) {
    return auth.jsonwebtoken.generate(payload, this.#secretKey);
  }

  static isAuthenticate(token) {
    const isAuth = auth.jsonwebtoken.verify(token, this.#secretKey);
    return isAuth;
  }

  static decodeToken(token) {
    const decode = auth.jsonwebtoken.decode(token);
    return decode;
  }
}

export default {
  authenticate: (...args) => Authentication.authenticate(...args),
  hash: (...args) => Authentication.hash(...args),
  generateToken: (...args) => Authentication.generateToken(...args),
  isAuthenticate: (...args) => Authentication.isAuthenticate(...args),
  decodeToken: (...args) => Authentication.decodeToken(...args)
};
