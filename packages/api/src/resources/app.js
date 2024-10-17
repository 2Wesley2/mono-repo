import 'express-async-errors';
import config from '../config/index.js';
import loaders from '../loaders/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import { salesController, customerController, employeeController } from '../resources/modules/index.js';

export default class App {
  constructor(app) {
    this.app = app;
    this.config();
    this.setRoutes();
    this.handleErrors();
  }

  config() {
    this.app.set('port', config.apiPort || 3000);
    loaders.express.init(this.app);
    config.logger.info('Configurações iniciais da aplicação carregadas.');
  }

  setRoutes() {
    this.app.get('/', (_, res) => res.json('Welcome to the SmartShop API'));
    config.logger.info('Definindo rotas para os controladores...');
    this.app.use('/api/customer', customerController.getRouter());
    this.app.use('/api/sale', salesController.getRouter());
    this.app.use('/api/employee', employeeController.getRouter());
  }

  handleErrors() {
    this.app.use(errorHandler);
    config.logger.info('Middleware de tratamento de erros registrado.');
  }
}
