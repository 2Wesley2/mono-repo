import { tokenService } from './index.js';

async function testTokenService() {
  // Dados de teste ajustados para geração do token
  const testPayload = { id: '123', role: 'testUser' }; // Adicionado `id` para atender à validação

  console.log('Iniciando testes com os serviços de token...');

  // Gerar e verificar tokens com JoseTokenService
  try {
    console.log('\n=== Testando JoseTokenService ===');
    const joseToken = await tokenService.joseService.generateToken(testPayload);
    console.log('Token gerado com JoseTokenService:', joseToken);

    const joseVerifiedPayload = await tokenService.joseService.verifyToken(joseToken);
    console.log('Payload verificado com JoseTokenService:', joseVerifiedPayload);
  } catch (error) {
    console.error('Erro com JoseTokenService:', error.message);
  }

  // Gerar e verificar tokens com JsonWebTokenService
  try {
    console.log('\n=== Testando JsonWebTokenService ===');
    const jsonWebToken = await tokenService.jsonWebTokenService.generateToken(testPayload);
    console.log('Token gerado com JsonWebTokenService:', jsonWebToken);

    const jsonWebVerifiedPayload = await tokenService.jsonWebTokenService.verifyToken(jsonWebToken);
    console.log('Payload verificado com JsonWebTokenService:', jsonWebVerifiedPayload);
  } catch (error) {
    console.error('Erro com JsonWebTokenService:', error.message);
  }

  console.log('\nTestes concluídos.');
}

// Executar a função de teste
testTokenService();
