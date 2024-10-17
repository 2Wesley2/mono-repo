import config from './config/index.js';
import Server from './resources/server.js';

const startServer = async () => {
  try {
    const server = new Server();
    await server.init();
    config.logger.info('Servidor iniciado com sucesso.');
  } catch (error) {
    config.logger.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
