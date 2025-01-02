import { DefaultSecretKeyValidator } from '../default/index.js';

export default class Base64SecretKeyValidator extends DefaultSecretKeyValidator {
  validate(secretKey) {
    super.validate(secretKey);

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64Regex.test(secretKey)) {
      throw new Error('A chave deve ser uma string válida codificada em Base64.');
    }

    const decoded = Buffer.from(secretKey, 'base64');
    if (decoded.length < 32) {
      throw new Error('A chave deve ter pelo menos 32 bytes quando decodificada.');
    }
  }
}
