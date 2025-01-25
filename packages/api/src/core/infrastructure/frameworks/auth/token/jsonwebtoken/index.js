import jwt from 'jsonwebtoken';
import payloadValidate from '../../../../../application/services/validators/PayloadValidator.js';
import secretKeyValidate from '../../../../../application/services/validators/SecretKeyValidator.js';
import tokenValidate from '../../../../../application/services/validators/TokenValidator.js';

class JsonWebToken {
  static async generateToken(payload, secretKey, options = { algorithm: 'HS256', expiresIn: '24h' }) {
    const validPayload = payloadValidate.validate(payload);
    const validSecretKey = await secretKeyValidate.validate(secretKey);
    if (!validSecretKey) {
      throw new TypeError('secretKey inválida');
    }
    if (!validPayload) {
      throw new TypeError(`payload inválido ${JSON.stringify(typeof validPayload)}`);
    }
    return jwt.sign(payload, secretKey, options);
  }

  static verifyToken(token, secretKey, options = { algorithms: ['HS256'] }) {
    const validSecretKey = secretKeyValidate.validate(secretKey);
    const validToken = tokenValidate.validate(token);
    if (!validToken || !validSecretKey) {
      throw new TypeError('token ou secretKey inválidos');
    }
    return jwt.verify(token, secretKey, options);
  }

  static decodeToken(token) {
    const validToken = tokenValidate.validate(token);
    if (!validToken) {
      throw new TypeError('token inválidos');
    }
    return jwt.decode(token);
  }
}

export default {
  generate: (...args) => JsonWebToken.generateToken(...args),
  verify: (...args) => JsonWebToken.verifyToken(...args),
  decode: (...args) => JsonWebToken.decodeToken(...args),
};
