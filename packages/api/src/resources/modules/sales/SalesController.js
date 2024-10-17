import { Router } from 'express';
import config from '../../../config/index.js';

class SalesController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.create.bind(this));
    this.router.get('/:id', this.findById.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
  }

  async create(req, res, next) {
    try {
      const sale = await this.service.create(req.body);
      config.logger.info('Controlador: Venda criada com sucesso', { data: sale });
      res.status(201).json(sale);
    } catch (error) {
      config.logger.error('Controlador: Erro ao criar venda', { error });
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const sale = await this.service.findById(id);
      config.logger.info('Controlador: Venda encontrada', { id });
      res.status(200).json(sale);
    } catch (error) {
      config.logger.error('Controlador: Erro ao buscar venda por ID', { id, error });
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedSale = await this.service.update(id, updatedData);
      config.logger.info('Controlador: Venda atualizada', { id, data: updatedSale });
      res.status(200).json(updatedSale);
    } catch (error) {
      config.logger.error('Controlador: Erro ao atualizar venda', { id, error });
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      config.logger.info('Controlador: Venda deletada', { id });
      res.status(204).json({ message: '' });
    } catch (error) {
      config.logger.error('Controlador: Erro ao deletar venda', { id, error });
      next(error);
    }
  }
  getRouter() {
    return this.router;
  }
}

export default SalesController;
