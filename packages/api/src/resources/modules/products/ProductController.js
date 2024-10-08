import { Router } from 'express';

class ProductController {
  constructor(service) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getAllProducts.bind(this));
    this.router.post('/', this.createProduct.bind(this));
    this.router.get('/:id', this.getProductById.bind(this));
    this.router.put('/:id', this.updateProduct.bind(this));
    this.router.delete('/:id', this.deleteProduct.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async getAllProducts(req, res, next) {
    try {
      const products = await this.service.getAllProducts(req.query);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = await this.service.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await this.service.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const updatedProduct = await this.service.updateProduct(req.params.id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await this.service.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
