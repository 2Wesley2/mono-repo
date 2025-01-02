export default class TokenService {
  constructor({ joseTokenService, jsonWebTokenService }) {
    this._joseTokenService = joseTokenService;
    this._jsonWebTokenService = jsonWebTokenService;
  }

  get joseService() {
    return this._joseTokenService;
  }

  get jsonWebTokenService() {
    return this._jsonWebTokenService;
  }
}
