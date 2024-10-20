import loaders from '../loaders/index.js';
import { listServerEndpoints } from '../helpers/listEndpointsHelper.js';
import debug from '../debug/index.js';

export default class Server {
  constructor(app) {
    this.app = app;
    this.appInstance = app.getInstance();
  }

  async init() {
    await this.app.configureApp();
    this.logEndpoints();
    debug.logger.info('server.js: Endpoints do servidor listados.');
  }

  start() {
    return new Promise((resolve, reject) => {
      const port = this.appInstance.get('port');
      this.server = this.appInstance.listen(port, () => {
        debug.logger.info(`server.js: Servidor rodando na porta: ${port}`);
        resolve();
      });

      this.server.on('error', (error) => {
        reject(error);
      });

      this.setupGracefulShutdown();
    });
  }

  logEndpoints() {
    listServerEndpoints(this.appInstance);
    debug.logger.info('server.js: Endpoints do servidor listados.');
  }

  async disconnectDB() {
    await loaders.mongoose.disconnect();
  }

  setupGracefulShutdown() {
    const gracefulShutdown = async (signal) => {
      debug.logger.warn(`server.js: Recebido sinal ${signal}, desligando graciosamente...`);
      await this.disconnectDB();
      this.server.close(() => {
        debug.logger.info('server.js: Todas as conexões foram encerradas.');
        process.exit(0);
      });

      setTimeout(() => {
        debug.logger.error('server.js: Forçando encerramento após 10 segundos.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
  }
}
