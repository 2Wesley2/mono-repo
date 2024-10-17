import { Router } from 'express';
import config from './config/index.js';

class CamadaDeController {
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
      const document = await this.service.create(req.body);
      config.logger.info('Controlador: Documento criado com sucesso', { data: document });
      res.status(201).json(document);
    } catch (error) {
      config.logger.error('Controlador: Erro ao criar documento', { error });
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const document = await this.service.findById(id);
      config.logger.info('Controlador: Documento encontrado', { id });
      res.status(200).json(document);
    } catch (error) {
      config.logger.error('Controlador: Erro ao buscar documento por ID', { id, error });
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedDocument = await this.service.update(id, updatedData);
      config.logger.info('Controlador: Documento atualizado', { id, data: updatedDocument });
      res.status(200).json(updatedDocument);
    } catch (error) {
      config.logger.error('Controlador: Erro ao atualizar documento', { id, error });
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      config.logger.info('Controlador: Documento deletado', { id });
      res.status(204).json({ message: '' });
    } catch (error) {
      config.logger.error('Controlador: Erro ao deletar documento', { id, error });
      next(error);
    }
  }
}

export default CamadaDeController;
