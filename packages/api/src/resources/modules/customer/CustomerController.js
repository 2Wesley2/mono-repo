import { Router } from 'express';

class CustomerController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/', this.createCustomer.bind(this));
    this.router.post('/:id/voucher', this.addVoucherToCustomer.bind(this));
    this.router.get('/', this.getCustomers.bind(this));
    this.router.get('/:id', this.getCustomerById.bind(this));
    this.router.delete('/:id', this.deleteCustomer.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async createCustomer(req, res, next) {
    try {
      const customer = await this.service.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async addVoucherToCustomer(req, res, next) {
    try {
      const { voucherId } = req.body;
      const customer = await this.service.addVoucherToCustomer(req.params.id, voucherId);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async getCustomers(req, res, next) {
    try {
      const customers = await this.service.getCustomers();
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(req, res, next) {
    try {
      const customer = await this.service.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.deleteCustomer(id);
      res.status(204).json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}

export default CustomerController;
