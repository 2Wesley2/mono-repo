import { Router } from 'express';
import config from '../../../config/index.js';

class CustomerController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.create.bind(this));
    this.router.get('/:cpf', this.findByCPF.bind(this));
  }

  async create(req, res, next) {
    try {
      const customer = await this.service.create(req.body);
      config.logger.info('Controlador: Cliente criado com sucesso', { data: customer });
      res.status(201).json(customer);
    } catch (error) {
      config.logger.error('Controlador: Erro ao criar cliente', { error });
      next(error);
    }
  }

  async findByCPF(req, res, next) {
    try {
      const { cpf } = req.params;
      const customer = await this.service.findByCPF(cpf);
      config.logger.info('Controlador: Cliente encontrado', { cpf });
      res.status(200).json(customer);
    } catch (error) {
      config.logger.error('Controlador: Erro ao buscar cliente', { cpf, error });
      next(error);
    }
  }

  getRouter() {
    return this.router;
  }
}

export default CustomerController;
