import express from 'express';

class ProductController {
  constructor(service) {
    this.service = service;
    this.router = express.Router();
    this.routes();
  }

  routes() {
    this.router.post('/products', this.createProduct.bind(this));
    this.router.get('/products/:id', this.getProduct.bind(this));
    this.router.get('/products', this.getAllProducts.bind(this));
    this.router.put('/products/:id', this.updateProduct.bind(this));
    this.router.delete('/products/:id', this.deleteProduct.bind(this));
  }
  async getAllProducts(req, res) {
    try {
      const products = await this.service.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await this.service.addProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await this.service.getProduct(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await this.service.modifyProduct(req.params.id, req.body);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await this.service.removeProduct(req.params.id);
      if (product) {
        res.json({ message: 'Produto removido com sucesso' });
      } else {
        res.status(404).json({ message: 'Produto não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getRouter() {
    return this.router;
  }
}

export default ProductController;
