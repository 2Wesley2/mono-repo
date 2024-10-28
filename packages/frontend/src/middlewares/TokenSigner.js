import { SignJWT } from 'jose';

class TokenSigner {
  constructor(tokenValidator) {
    this.tokenValidator = tokenValidator;
  }

  async sign(payload) {
    const secret = this.tokenValidator.getSecret();
    if (!secret) {
      console.log('Chave de criptografia não encontrada.', 'ERROR');
      throw new Error('Erro ao obter chave de criptografia.');
    }
    try {
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);
      console.log('Payload assinado com sucesso.');
      return token;
    } catch (error) {
      console.log('Erro ao assinar o payload.', 'ERROR', { error: error.message });
      throw error;
    }
  }
}
export default TokenSigner;
