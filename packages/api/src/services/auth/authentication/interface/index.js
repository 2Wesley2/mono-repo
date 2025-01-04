export default class Authentication {
  constructor({ tokenService, cryptoService }) {
    this.tokenService = tokenService;
    this.cryptoService = cryptoService;
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
