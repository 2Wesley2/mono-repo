import { Router } from 'express';
import config from '../../../config/index.js';

class TicketController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/:id', this.findById.bind(this));
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
}

export default TicketController;
