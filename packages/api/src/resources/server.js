// server.js
import express from 'express';
import cors from 'cors';
import config from '../config/index.js';
import loaders from '../loaders/index.js';
import { listServerEndpoints } from '../helpers/listEndpointsHelper.js';
import errorHandler from '../middlewares/errorHandler.js';
import { salesController, customerController, employeeController } from '../resources/modules/index.js';

export default class Server {
  constructor() {
    config.logger.info('Instância do servidor criada.');
    this.app = express();
    this.server = null;
  }

  async init() {
    this.configureMiddlewares();
    this.setRoutes();
    this.configureLogging();
    this.handleErrors();
    await loaders.mongoose.init();
    listServerEndpoints(this.app);
    config.logger.info('Endpoints do servidor listados.');
    this.startServer();
  }

  configureMiddlewares() {
    this.app.set('port', config.apiPort);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    config.logger.info('Middlewares de parsing e CORS configurados.');
  }

  setRoutes() {
    this.app.get('/', (_, res) => res.json('Welcome to the SmartShop API'));
    config.logger.info('Definindo rotas para os controladores...');
    this.app.use('/api/customer', customerController.getRouter());
    this.app.use('/api/sale', salesController.getRouter());
    this.app.use('/api/employee', employeeController.getRouter());
  }

  configureLogging() {
    this.app.use((req, res, next) => {
      const { method, url } = req;
      const timestamp = new Date().toISOString();
      config.logger.info(`[${timestamp}] ${method} ${url}`);
      next();
    });
    config.logger.info('Middleware de logging de requisições configurado.');
  }

  handleErrors() {
    this.app.use(errorHandler);
    config.logger.info('Middleware de tratamento de erros registrado.');
  }

  startServer() {
    const port = this.app.get('port');
    this.server = this.app.listen(port, () => {
      config.logger.info(`Servidor rodando na porta: ${port}`);
    });
    this.setupGracefulShutdown();
  }

  setupGracefulShutdown() {
    const gracefulShutdown = async (signal) => {
      config.logger.warn(`Recebido sinal ${signal}, desligando graciosamente...`);
      this.server.close(async () => {
        await loaders.mongoose.disconnect();
        config.logger.info('Todas as conexões foram encerradas.');
        process.exit(0);
      });

      setTimeout(() => {
        config.logger.error('Forçando encerramento após 10 segundos.');
        process.exit(1);
      }, 10000);
    };
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
  }
}
