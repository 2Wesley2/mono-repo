import { jwtVerify } from 'jose';

class TokenValidator {
  constructor(secret) {
    this.secret = secret;
  }

  async isValid(token) {
    if (!token) {
      console.log('TokenValidator.js: Token ausente ou indefinido.', 'WARN');
      return false;
    }
    try {
      await jwtVerify(token, this.secret, { algorithms: ['HS256'] });
      return true;
    } catch (error) {
      console.log('TokenValidator.js: Erro na verificação do token.', 'ERROR', {
        error: error.message,
      });
      return false;
    }
  }

  async getPayload(token) {
    if (!token) return null;
    try {
      const { payload } = await jwtVerify(token, this.secret);
      console.log('TokenValidator.js: Token verificado com sucesso.');
      return payload;
    } catch (error) {
      console.log('TokenValidator.js: Falha na verificação do token.', 'WARN', {
        error: error.message,
      });
      return null;
    }
  }

  getSecret() {
    return this.secret;
  }
}

export default TokenValidator;
