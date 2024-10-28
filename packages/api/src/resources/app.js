import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import debug from '../debug/index.js';
import config from '../config/index.js';
import loaders from '../loaders/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import { customerController, employeeController, salesController, userController } from '../resources/modules/index.js';

export default class App {
  constructor() {
    this.app = express();
  }

  async configureApp() {
    await this.connectDatabase();
    this.setPort();
    this.configureMiddlewares();
    this.setRoutes();
    this.configureLogging();
    this.handleErrors();
  }

  async connectDatabase() {
    await loaders.mongoose.init();
    debug.logger.info('app.js: Banco de dados conectado.');
  }

  setPort() {
    const port = config.apiPort || 3009;
    this.app.set('port', port);
    debug.logger.info(`app.js: Porta definida para ${port}.`);
  }

  configureMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
      }),
    );
    this.app.use(cookieParser());
    debug.logger.info('app.js: Middlewares de parsing e CORS configurados.');
  }

  setRoutes() {
    this.app.get('/', (_, res) => res.json('Hello World'));
    debug.logger.info('app.js: Definindo rotas para os controladores...');
    try {
      this.app.use('/api/customer', customerController.getRouter());
      this.app.use('/api/employee', employeeController.getRouter());
      this.app.use('/api/sale', salesController.getRouter());
      this.app.use('/api/user', userController.getRouter());
    } catch (error) {
      debug.logger.error('app.js: Erro ao definir rotas para os controladores:', error);
      throw error;
    }
  }

  configureLogging() {
    this.app.use((req, res, next) => {
      const { method, url } = req;
      const timestamp = new Date().toISOString();
      debug.logger.info(`[${timestamp}] ${method} ${url}`);
      next();
    });
    debug.logger.info('app.js: Middleware de logging de requisições configurado.');
  }

  handleErrors() {
    this.app.use(errorHandler);
    debug.logger.info('app.js: Middleware de tratamento de erros registrado.');
  }

  getInstance() {
    return this.app;
  }
}
