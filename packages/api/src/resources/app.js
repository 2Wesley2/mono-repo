import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import debug from '../debug/index.js';
import config from '../config/index.js';
import loaders from '../loaders/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import {
  customerController,
  employeeController,
  salesController,
  userController,
  ticketService,
  cashbackController,
  productController,
  orderController,
} from '../resources/modules/index.js';

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
    this.scheduleDailyTicketCheck();
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
    this.app.use((req, res, next) => {
      console.log('[DEBUG] Body parseado pelo Express:', req.body);
      next();
    });
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
      this.app.use((req, res, next) => {
        console.log(`[DEBUG] Incoming request: ${req.method} ${req.originalUrl}`);
        next();
      });
      this.app.use('/api/customer', customerController.getRouter());
      this.app.use('/api/employee', employeeController.getRouter());
      this.app.use('/api/sale', salesController.getRouter());
      this.app.use('/api/user', userController.getRouter());
      this.app.use('/api/cashback', cashbackController.getRouter());
      this.app.use('/api/product', productController.getRouter());
      this.app.use('/api/order', orderController.getRouter());
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

  scheduleDailyTicketCheck() {
    const checkTicketsExpiringSoon = async () => {
      try {
        const daysUntilExpiry = 7;
        const expiringTickets = await ticketService.findTicketsExpiringSoon(daysUntilExpiry);

        for (const ticket of expiringTickets) {
          const cliente = await customerController.findClienteByCPF(ticket.clientCPF);

          if (cliente) {
            const mensagem = `
            Olá! Seu ticket está próximo de expirar em 
            ${ticket.expiryDate.toLocaleDateString()}. 
            Use-o antes dessa data para aproveitar o desconto.
            `;
            await notificationService.sendToAllChannels(cliente, mensagem);

            debug.logger.info('Notificação enviada para cliente com ticket próximo de expirar.', {
              clientCPF: ticket.clientCPF,
              expiryDate: ticket.expiryDate,
            });
          } else {
            debug.logger.warn('Cliente não encontrado para notificação de ticket expiring soon', {
              clientCPF: ticket.clientCPF,
            });
          }
        }

        debug.logger.info('App.js: Verificação diária de tickets próximos de expirar concluída.', {
          count: expiringTickets.length,
        });
      } catch (error) {
        debug.logger.error('App.js: Erro na verificação diária de tickets:', error);
      }
    };

    loaders.cron.scheduleJob('checkTicketsExpiringSoon', '0 0 * * *', checkTicketsExpiringSoon);
  }

  handleErrors() {
    this.app.use(errorHandler);
    debug.logger.info('app.js: Middleware de tratamento de erros registrado.');
  }

  getInstance() {
    return this.app;
  }
}
