import App from './resources/app.js';
import Server from './resources/server.js';
import debug from './debug/index.js';

const startServer = async () => {
  try {
    const app = new App();
    const server = new Server(app);

    await server.init();
    await server.start();
    debug.logger.info('main.js: Servidor iniciado com sucesso.');
  } catch (error) {
    debug.logger.error('main.js: Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
