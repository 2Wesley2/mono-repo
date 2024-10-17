import { Router } from 'express';
import config from '../../config/index.js';

class Controller {
  constructor(service, documentName) {
    this.service = service;
    this.documentName = documentName;
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
      config.logger.info(`Controlador: ${this.documentName} criado com sucesso`, { data: document });
      res.status(201).json(document);
    } catch (error) {
      config.logger.error(`Controlador: Erro ao criar ${this.documentName}`, { error });
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const document = await this.service.findById(id);
      config.logger.info(`Controlador: ${this.documentName} encontrado`, { id });
      res.status(200).json(document);
    } catch (error) {
      config.logger.error(`Controlador: Erro ao buscar ${this.documentName} por ID`, { id, error });
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedDocument = await this.service.update(id, updatedData);
      config.logger.info(`Controlador: ${this.documentName} atualizado`, { id, data: updatedDocument });
      res.status(200).json(updatedDocument);
    } catch (error) {
      config.logger.error(`Controlador: Erro ao atualizar ${this.documentName}`, { id, error });
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      config.logger.info(`Controlador:${this.documentName} deletado`, { id });
      res.status(204).json({ message: '' });
    } catch (error) {
      config.logger.error(`Controlador: Erro ao deletar ${this.documentName}`, { id, error });
      next(error);
    }
  }

  getRouter() {
    return this.router;
  }
}

export default Controller;
