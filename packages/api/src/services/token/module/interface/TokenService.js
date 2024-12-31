import { SignJWT, jwtVerify } from 'jose';
import { UnauthorizedError, InvalidRequestError, GenericError } from '../../../../errors/Exceptions.js';

export default class TokenService {
  constructor({ secretKey, joseSecretKeyFormatter, userPayloadValidator }) {
    this.secretKey = secretKey;
    this.userPayloadValidator = userPayloadValidator;
    this.joseSecretKeyFormatter = joseSecretKeyFormatter;
  }

  get #_secretKey() {
    if (!this.secretKey) {
      console.error('TokenService: Chave secreta não definida.');
      throw new Error('Chave secreta não definida no TokenService.');
    }
    return this.#_joseFormatSecretKey(this.secretKey);
  }

  #_joseFormatSecretKey(secretKey) {
    console.log('TokenService: Formatando chave secreta. Valor recebido:', secretKey);
    const formattedKey = this.joseSecretKeyFormatter.format(secretKey);
    console.log('TokenService: Chave secreta formatada com sucesso.');
    return formattedKey;
  }

  async generateToken(payload) {
    try {
      console.log('TokenService: Iniciando geração de token...');
      this.userPayloadValidator.validate(payload);
      console.log('TokenService: Payload validado com sucesso:', payload);

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(this.#_secretKey);

      console.log('TokenService: Token gerado com sucesso.');
      return token;
    } catch (error) {
      console.error('TokenService: Erro ao gerar token:', error.message);
      if (error instanceof InvalidRequestError) {
        throw error;
      }
      throw new Error('Internal Server Error');
    }
  }

  async verifyToken(token) {
    try {
      if (!token) {
        return new Error('token inválido');
      }
      const { payload } = await jwtVerify(token, this.#_secretKey, {
        algorithms: ['HS256'],
      });
      return payload;
    } catch (error) {
      if (error instanceof InvalidRequestError) throw error;
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }
}
