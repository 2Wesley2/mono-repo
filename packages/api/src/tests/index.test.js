describe('Teste de exemplo', () => {
  test('Hello World', () => {
    const mensagem = 'Hello World';
    expect(mensagem).toBe('Hello World');
  });
});
describe('Configuração de ambiente', () => {
  test('deve carregar a JWT_SECRET corretamente', () => {
    expect(process.env.JWT_SECRET).toBe('minhaChaveSecretaDeTeste');
  });
});
