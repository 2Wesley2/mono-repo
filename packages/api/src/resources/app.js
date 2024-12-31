/**
 * Importação de middlewares e dependências externas necessárias para o funcionamento da aplicação.
 */

import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import debug from '../debug/index.js';
import config from '../config/index.js';
import loaders from '../loaders/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import {
  customerController,
  employeeController,
  userController,
  productController,
  orderController,
  rewardController,
  calcRefController,
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
    debug.logger.info('app.js: Middlewares de parsing e CORS configurados.');
  }

  /**
   * Define as rotas da aplicação e associa os controladores.
   * @throws {Error} Lança um erro caso ocorra problema ao definir rotas.
   */
  setRoutes() {
    this.app.get('/', (_, res) => res.json('Hello World'));
    debug.logger.info('app.js: Definindo rotas para os controladores...');
    try {
      this.logRequests();
      this.app.use('/api/customer', customerController.getRouter());
      this.app.use('/api/employee', employeeController.getRouter());
      this.app.use('/api/user', userController.getRouter());
      this.app.use('/api/product', productController.getRouter());
      this.app.use('/api/order', orderController.getRouter());
      this.app.use('/api/reward', rewardController.getRouter());
      this.app.use('/api/calcRef', calcRefController.getRouter());

      this.app.post('/api/rebatedor/pre-authorization', this.handlePreAuthorizationRequest);
    } catch (error) {
      debug.logger.error('app.js: Erro ao definir rotas para os controladores:', error);
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

  /**
   * Função para tratar a requisição de pré-autorização.
   * Faz uma requisição para o endpoint de pré-autorização de outra API.
   */
  handlePreAuthorizationRequest(req, res) {
    const { amount, currencyPosition, currencyCode, orderId } = req.body;

    if (!amount || !currencyPosition || !currencyCode || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Dados insuficientes para realizar a pré-autorização.',
      });
    }

    const requestBody = JSON.stringify({
      amount,
      currencyPosition,
      currencyCode,
      orderId,
    });

    const endpoint = 'getnet://pagamento/v1/pre-authorization';

    const parsedUrl = new URL(endpoint);

    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const request = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          res.json({
            success: true,
            message: 'Pré-autorização realizada com sucesso.',
            data: parsedData,
          });
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Erro ao processar a resposta.',
            error: error.message,
          });
        }
      });
    });

    request.on('error', (error) => {
      res.status(500).json({
        success: false,
        message: 'Falha ao realizar a pré-autorização.',
        error: error.message,
      });
    });

    request.write(requestBody);
    request.end();
  }
}
