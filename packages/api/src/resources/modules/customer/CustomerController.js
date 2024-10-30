import Controller from '../../core/Controller.js';
import debug from '../../../debug/index.js';
import AuthMiddleware from '../../../middlewares/authMiddleware.js';
import AuthorizationMiddleware from '../../../middlewares/authorizationMiddleware.js';

class CustomerController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/register', this.create.bind(this));
    this.router.get('/all', this.getAllCustomers.bind(this));
    this.router.get('/:cpf', this.findByCPF.bind(this));
    this.router.get('/:cpf/tickets', this.getTicketsByCustomer.bind(this));
  }

  async create(req, res, next) {
    try {
      const customerData = req.body;
      if (!customerData.name || !customerData.cpf) {
        return res.status(400).json({ message: 'Nome e CPF são obrigatórios para criar o cliente' });
      }

      const newCustomer = await this.service.createCustomer(customerData);
      debug.logger.info('Controlador: Cliente criado com sucesso', { customerData });
      res.status(201).json(newCustomer);
    } catch (error) {
      debug.logger.error('Controlador: Erro ao criar cliente', { error });
      next(error);
    }
  }

  async findByCPF(req, res, next) {
    try {
      const { cpf } = req.params;
      if (!cpf) {
        debug.logger.warn('CPF não fornecido');
        return res.status(400).json({ message: 'CPF é obrigatório' });
      }
      const customer = await this.service.findByCPF(cpf);
      debug.logger.info('Controlador: Cliente encontrado', { cpf });
      res.status(200).json(customer);
    } catch (error) {
      debug.logger.error('Controlador: Erro ao buscar cliente', { cpf, error });
      next(error);
    }
  }

  async getAllCustomers(req, res, next) {
    try {
      const employees = await this.service.getAllCustomers(req.query);
      res.json(employees);
    } catch (error) {
      next(error);
    }
  }

  async getTicketsByCustomer(req, res, next) {
    const { cpf } = req.params;
    try {
      debug.logger.info(`CustomerController.js: Iniciando busca de tickets para o ${cpf}`);
      const tickets = await this.service.getTicketsByCustomer(cpf);

      debug.logger.info(`CustomerController.js: Retornando ${tickets} do ${cpf}`, {
        cpf,
        ticketsCount: tickets.length,
        tickets,
      });

      res.status(200).json(tickets);
    } catch (error) {
      debug.logger.error(`CustomerController.js: Erro ao buscar tickets do ${cpf}`, { error: error.message });
      next(error);
    }
  }
}

export default CustomerController;
