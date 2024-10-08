import Server from './resources/server.js';

const startServer = async () => {
  try {
    const server = new Server();
    await server.init();

    console.log('Servidor iniciado com sucesso.');
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();
