import { Router } from 'express';
import config from '../../../config/index.js';

class TicketController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.create.bind(this));
    this.router.get('/:id', this.findById.bind(this));
    this.router.put('/apply/:id', this.applyTicket.bind(this));
  }

  async create(req, res, next) {
    try {
      const { clientCPF, discount } = req.body;
      const ticket = await this.service.create(clientCPF, discount);
      config.logger.info('Controlador: Ticket criado com sucesso', { data: ticket });
      res.status(201).json(ticket);
    } catch (error) {
      config.logger.error('Controlador: Erro ao criar ticket', { error });
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const ticket = await this.service.findById(id);
      config.logger.info('Controlador: Ticket encontrado', { id });
      res.status(200).json(ticket);
    } catch (error) {
      config.logger.error('Controlador: Erro ao buscar ticket', { id, error });
      next(error);
    }
  }

  async applyTicket(req, res, next) {
    try {
      const { id } = req.params;
      const { clientCPF } = req.body;
      const ticket = await this.service.applyTicket(id, clientCPF);
      config.logger.info('Controlador: Ticket aplicado com sucesso', { id });
      res.status(200).json(ticket);
    } catch (error) {
      config.logger.error('Controlador: Erro ao aplicar ticket', { id, error });
      next(error);
    }
  }
}

export default TicketController;
