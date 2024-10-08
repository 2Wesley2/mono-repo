import 'express-async-errors';
import config from '../config/index.js';
import loaders from '../loaders/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import {
  productController,
  // orderController,
  //paymentController,
  customerController,
  cashbackController,
  employeeController,
} from '../resources/modules/index.js';

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
  }

  setRoutes() {
    this.app.get('/', (_, res) => res.json('Welcome to the SmartShop API'));
    this.app.use('/api/products', productController.getRouter());
    //this.app.use('/api/orders', orderController.getRouter());
    //this.app.use('/api/payments', paymentController.getRouter());
    this.app.use('/api/customer', customerController.getRouter());
    this.app.use('/api/cashback', cashbackController.getRouter());
    this.app.use('/api/employee', employeeController.getRouter());
  }

  handleErrors() {
    this.app.use(errorHandler);
  }
}
