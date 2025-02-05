import Server from '#resources/server.js';
import App from '#src/resources/app.js';

describe('Server Initialization', () => {
  let app;
  let server;

  beforeAll(async () => {
    app = new App();
    server = new Server(app);
    await server.init();
  });

  test('deve inicializar o aplicativo sem erros', () => {
    expect(app).toBeDefined();
    expect(app.getInstance()).toBeDefined();
  });

  test('deve configurar o servidor corretamente', async () => {
    await server.start();
    expect(server.server).toBeDefined();
    expect(server.server.address()).toBeTruthy();
  });

  afterAll(async () => {
    await server.disconnectDB();
    server.server.close();
  });
});
