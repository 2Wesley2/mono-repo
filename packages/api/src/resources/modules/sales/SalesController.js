import express from 'express';

class SalesController {
  constructor(service) {
    this.service = service;
    this.router = express.Router();
    this.routes();
  }

  routes() {
    this.router.post('/sales', this.createSale.bind(this));
    this.router.get('/sales/:id', this.getSale.bind(this));
    this.router.get('/sales', this.getAllSales.bind(this));
  }

  async createSale(req, res) {
    try {
      const sale = await this.service.createSale(req.body);
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSale(req, res) {
    try {
      const sale = await this.service.getSale(req.params.id);
      if (sale) {
        res.json(sale);
      } else {
        res.status(404).json({ message: 'Venda não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllSales(req, res) {
    try {
      const sales = await this.service.getAllSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getRouter() {
    return this.router;
  }
}

export default SalesController;
