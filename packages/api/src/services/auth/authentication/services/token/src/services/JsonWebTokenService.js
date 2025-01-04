import jwt from 'jsonwebtoken';
import { UnauthorizedError, InvalidRequestError } from '../../../../../../../errors/Exceptions.js';

export default class JsonWebTokenService {
  constructor({ secretKey, jsonWebTokenSecretKeyFormatter, userPayloadValidator }) {
    this.secretKey = secretKey;
    this.userPayloadValidator = userPayloadValidator;
    this.jsonWebTokenSecretKeyFormatter = jsonWebTokenSecretKeyFormatter;
  }

  get #_secretKey() {
    if (!this.secretKey) {
      console.error('JsonWebTokenService: Chave secreta não definida.');
      throw new Error('Chave secreta não definida no JsonWebTokenService.');
    }
    return this.#_formatSecretKey(this.secretKey);
  }

  #_formatSecretKey(secretKey) {
    const formattedKey = this.jsonWebTokenSecretKeyFormatter.format(secretKey);
    return formattedKey;
  }

  async generateToken(payload) {
    try {
      this.userPayloadValidator.validate(payload);
      const token = jwt.sign(payload, this.#_secretKey, {
        algorithm: 'HS256',
        expiresIn: '24h',
      });

      return token;
    } catch (error) {
      console.error('JsonWebTokenService: Erro ao gerar token:', error.message);
      if (error instanceof InvalidRequestError) {
        throw error;
      }
      throw new Error('Internal Server Error');
    }
  }

  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('Token inválido.');
      }

      const payload = jwt.verify(token, this.#_secretKey, {
        algorithms: ['HS256'],
      });

      return payload;
    } catch (error) {
      console.error('JsonWebTokenService: Erro ao verificar token:', error.message);
      if (error instanceof InvalidRequestError) throw error;
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }
}
