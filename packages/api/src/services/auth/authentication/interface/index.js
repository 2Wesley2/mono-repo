import { Authenticator } from '../contracts/index.js';

export default class Authentication extends Authenticator {
  constructor({ tokenService, cryptoService }) {
    this.tokenService = tokenService;
    this.cryptoService = cryptoService;
  }

  async authenticate(passwordProvided, passwordHashed) {
    const validatedPassword = await this.validatePassword(passwordProvided, passwordHashed);
    return validatedPassword;
  }

  async isAuthenticate(token) {
    const isAuth = await this.verifyToken(token);
    return isAuth;
  }

  async validatePassword(passwordProvided, passwordHashed) {
    const isValidPassword = await this.cryptoService.validatePassword(passwordProvided, passwordHashed);
    return isValidPassword;
  }

  async hashPassword(password) {
    const hashedPassword = await this.cryptoService.hash(password);
    return hashedPassword;
  }

  async generateToken(payload) {
    const tokenGenereted = await this.tokenService.generateToken(payload);
    return tokenGenereted;
  }

  async verifyToken(token) {
    const isValidToken = await this.tokenService.verifyToken(token);
    return isValidToken;
  }
}
