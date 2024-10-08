import express from 'express';
import loaders from '../loaders/index.js';
import { listServerEndpoints } from '../helpers/listEndpointsHelper.js';
import App from './app.js';
export default class Server {
  constructor() {
    this.app = express();
    this.server = null;
  }

  async init() {
    new App(this.app);
    this.app.use((req, res, next) => {
      const { method, url } = req;
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${method} ${url}`);
      next();
    });

    await loaders.mongoose.init();
    listServerEndpoints(this.app);
    this.startServer();
  }

  startServer() {
    const port = this.app.get('port') || process.env.PORT || 3000;
    this.server = this.app.listen(port, () => {
      console.log(`Servidor rodando na porta: ${port}`);
    });
    this.setupGracefulShutdown();
  }

  setupGracefulShutdown() {
    const gracefulShutdown = async (signal) => {
      console.log(`Recebido sinal ${signal}, desligando graciosamente...`);
      this.server.close(async () => {
        await loaders.mongoose.disconnect();
        console.log('Todas as conexões foram encerradas.');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forçando encerramento após 10 segundos.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
  }
}
