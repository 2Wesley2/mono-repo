/**
 * Importação de middlewares e dependências externas necessárias para o funcionamento da aplicação.
 */

import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import debug from '../debug/index.js';
import config from '../config/index.js';
import loaders from '../core/loaders/index.js';
import errorHandler from '../core/middlewares/errorHandler.js';
import {
  customerController,
  employeeController,
  productController,
  orderController,
  rewardController,
  calcRefController,
  ownerUserController,
} from '../resources/modules/index.js';

/**
 * Classe principal responsável por configurar e inicializar a aplicação Express.
 */
export default class App {
  /**
   * Inicializa uma nova instância da classe App.
   * Cria uma aplicação Express.
   */
  constructor() {
    /**
     * A instância da aplicação Express.
     * @type {express.Application}
     */
    this.app = express();
  }

  /**
   * Configura a aplicação, conectando ao banco de dados, configurando middlewares, rotas e tratamento de erros.
   * @async
   */
  async configureApp() {
    await this.connectDatabase();
    this.setPort();
    this.configureMiddlewares();
    this.setRoutes();
    this.handleErrors();
  }

  /**
   * Conecta ao banco de dados utilizando o módulo de loaders.
   * @async
   * @returns {Promise<void>} Uma promessa que resolve após a conexão com o banco de dados.
   */
  async connectDatabase() {
    await loaders.mongoose.init();
    debug.logger.info('app.js: Banco de dados conectado.');
  }

  /**
   * Define a porta na qual a aplicação será executada.
   */
  setPort() {
    const port = config.apiPort || 3009;
    this.app.set('port', port);
    debug.logger.info(`app.js: Porta definida para ${port}.`);
  }

  /**
   * Configura os middlewares globais para parsing de requisições e CORS.
   */
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
  }

  /**
   * Define as rotas da aplicação e associa os controladores.
   * @throws {Error} Lança um erro caso ocorra problema ao definir rotas.
   */
  setRoutes() {
    this.app.get('/', (_, res) => res.json('Hello World'));
    try {
      this.logRequests();
      this.app.use('/api/customer', customerController.getRouter());
      this.app.use('/api/employee', employeeController.getRouter());
      this.app.use('/', ownerUserController.getRouter());
      this.app.use('/api/product', productController.getRouter());
      this.app.use('/api/order', orderController.getRouter());
      this.app.use('/api/reward', rewardController.getRouter());
      this.app.use('/api/calcRef', calcRefController.getRouter());
    } catch (error) {
      throw error;
    }
  }

  /**
   * Middleware que registra todas as requisições recebidas pela aplicação.
   */
  logRequests() {
    this.app.use((req, res, next) => {
      const { method, url } = req;
      const timestamp = new Date().toISOString();
      debug.logger.info(`[DEBUG] Incoming request: [${timestamp}] ${method} ${url}`);
      next();
    });
  }

  /**
   * Registra o middleware de tratamento de erros globais.
   */
  handleErrors() {
    this.app.use(errorHandler);
    debug.logger.info('app.js: Middleware de tratamento de erros registrado.');
  }

  /**
   * Recupera a instância da aplicação Express.
   * @returns {express.Application} A instância da aplicação Express.
   */
  getInstance() {
    return this.app;
  }
}
