import { Router } from 'express';

class SaleController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAllSales.bind(this));
    this.router.post('/', this.createSale.bind(this));
    this.router.get('/:id', this.getSaleById.bind(this));
    this.router.put('/:id', this.updateSale.bind(this));
    this.router.delete('/:id', this.deleteSale.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async getAllSales(req, res, next) {
    try {
      const sales = await this.service.getAllSales(req.query);
      res.json(sales);
    } catch (error) {
      next(error);
    }
  }

  async createSale(req, res, next) {
    try {
      const { voucherId } = req.body;
      const sale = await this.service.createSale({ ...req.body, voucherId });
      res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  }

  async getSaleById(req, res, next) {
    try {
      const sale = await this.service.getSaleById(req.params.id);
      res.json(sale);
    } catch (error) {
      next(error);
    }
  }

  async updateSale(req, res, next) {
    try {
      const updatedSale = await this.service.updateSale(req.params.id, req.body);
      res.json(updatedSale);
    } catch (error) {
      next(error);
    }
  }

  async deleteSale(req, res, next) {
    try {
      await this.service.deleteSale(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default SaleController;
