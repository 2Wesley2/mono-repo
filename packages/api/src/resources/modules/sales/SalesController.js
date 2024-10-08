import express from 'express';

class SalesController {
  constructor(service) {
    this.service = service;
    this.router = express.Router();
    this.routes();
  }

  routes() {
    this.router.post('/', this.createSale.bind(this));
    this.router.get('/:id', this.getSale.bind(this));
    this.router.get('/', this.getAllSales.bind(this));
    this.router.put('/:id', this.updateSale.bind(this));
    this.router.delete('/:id', this.deleteSale.bind(this));
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

  async updateSale(req, res) {
    try {
      const sale = await this.service.updateSale(req.params.id, req.body);
      if (sale) {
        res.json(sale);
      } else {
        res.status(404).json({ message: 'Venda não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteSale(req, res) {
    try {
      const sale = await this.service.deleteSale(req.params.id);
      if (sale) {
        res.json({ message: 'Venda deletada com sucesso' });
      } else {
        res.status(404).json({ message: 'Venda não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getRouter() {
    return this.router;
  }
}

export default SalesController;
