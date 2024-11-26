import Controller from '../../core/Controller.js';
import debug from '../../../debug/index.js';
//import AuthMiddleware from '../../../middlewares/authMiddleware.js';
//import AuthorizationMiddleware from '../../../middlewares/authorizationMiddleware.js';

class CustomerController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/register', this.createCustomer.bind(this));
    this.router.get('/all', this.getAllCustomers.bind(this));
    this.router.get('/:cpf', this.findByCPF.bind(this));
    this.router.get('/:cpf/tickets', this.getTicketsByCustomer.bind(this));
    this.router.put('/:id', this.updateCustomer.bind(this));
    this.router.delete('/:id', this.deleteCustomer.bind(this));
  }

  async createCustomer(req, res, next) {
    try {
      const customerData = req.body;
      if (!customerData.name || !customerData.cpf || !customerData.phone) {
        return res.status(400).json({ message: 'Nome, CPF e Celular são obrigatórios para criar o cliente' });
      }

      const newCustomer = await this.service.createCustomer(customerData);
      debug.logger.info('Controlador: Cliente criado com sucesso', { customerData });
      res.status(201).json(newCustomer);
    } catch (error) {
      debug.logger.error('Controlador: Erro ao criar cliente', { error });
      next(error);
    }
  }

  async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id || !updateData) {
        return res.status(400).json({ message: 'ID e dados de atualização são obrigatórios' });
      }
      const updatedCustomer = await this.service.updateCustomer(id, updateData);
      debug.logger.info('Controlador: Cliente atualizado', { id, updateData });
      res.status(200).json(updatedCustomer);
    } catch (error) {
      debug.logger.error('Controlador: Erro ao atualizar cliente', { id, error });
      next(error);
    }
  }

  async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID é obrigatório' });
      }
      await this.service.deletCustomere(id);
      debug.logger.info('Controlador: Cliente deletado', { id });
      res.status(204).end();
    } catch (error) {
      debug.logger.error('Controlador: Erro ao deletar cliente', { id, error });
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
      const customers = await this.service.getAllCustomers(req.query);
      res.json(customers);
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
