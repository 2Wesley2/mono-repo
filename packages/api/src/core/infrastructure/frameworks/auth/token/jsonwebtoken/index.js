import jwt from 'jsonwebtoken';
import { isString } from '../../../../../../helpers/stringHelper.js';
import { InvalidRequestError, UnprocessableEntityError } from '../../../../../../errors/Exceptions.js';

/**
 * Classe responsável por gerenciar operações de geração e verificação de tokens usando jsonwebtoken.
 */
class JsonWebToken {
  static async generateToken(payload, secretKey, options = { algorithm: 'HS256', expiresIn: '24h' }) {
    if (!payload) {
      throw new InvalidRequestError([{ field: 'payload', message: 'Payload is required' }], 'Token payload is missing');
    }

    if (typeof payload !== 'object' || Array.isArray(payload)) {
      throw new UnprocessableEntityError(
        [{ field: 'payload', message: 'Payload must be a non-array object' }],
        'Invalid payload format',
      );
    }

    const { id, role } = payload;
    if (!id || typeof id !== 'string') {
      throw new InvalidRequestError(
        [{ field: 'id', message: 'ID is required and must be a string' }],
        'Invalid or missing ID in payload',
      );
    }

    if (!role || typeof role !== 'string') {
      throw new InvalidRequestError(
        [{ field: 'role', message: 'Role is required and must be a string' }],
        'Invalid or missing role in payload',
      );
    }
    if (!isString(secretKey)) {
      throw new Error('A chave secreta deve ser uma string válida.');
    }

    try {
      return jwt.sign(payload, secretKey, options);
    } catch (error) {
      console.error('JsonWebToken: Erro ao gerar token:', error.message);
      throw new Error('Erro interno ao gerar o token.');
    }
  }

  static async verifyToken(token, secretKey, options = { algorithms: ['HS256'] }) {
    const args = [token, secretKey];

    if (!isString([...args])) {
      throw new Error('A chave secreta e o token devem ser uma string válida.');
    }

    try {
      return jwt.verify(token, secretKey, options);
    } catch (error) {
      console.error('JsonWebToken: Erro ao verificar token:', error.message);
      throw new Error('Token inválido ou expirado.');
    }
  }

  static decodeToken(token) {
    if (!isString(token)) {
      throw new Error('O token deve ser uma string válida para inciar decoficação');
    }
    try {
      return jwt.decode(token);
    } catch (error) {
      console.error('JsonWebToken: Erro ao decodificar token:', error.message);
      return null;
    }
  }
}

export default {
  generate: (...args) => JsonWebToken.generateToken(...args),
  verify: (...args) => JsonWebToken.verifyToken(...args),
  decode: (...args) => JsonWebToken.decodeToken(...args),
};
