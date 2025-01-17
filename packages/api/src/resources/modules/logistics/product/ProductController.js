import Controller from '../../../components/Controller.js';
import debug from '../../../../debug/index.js';

class ProductController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/', this.createProduct.bind(this));
    this.router.post('/bulk', this.bulkCreate.bind(this));
    this.router.put('/:id', this.updateProduct.bind(this));
    this.router.delete('/:id', this.deleteProduct.bind(this));
    this.router.get('/category/:category', this.findByCategory.bind(this));
    this.router.get('/search', this.searchProducts.bind(this));
  }

  async createProduct(req, res, next) {
    try {
      const product = await this.service.createProduct(req.body);
      debug.logger.info('Controller: Product created successfully', { data: product });
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      debug.logger.error('Controller: Error creating product', { error });
      next(error);
    }
  }
  async bulkCreate(req, res, next) {
    try {
      const products = await this.service.bulkCreate(req.body);
      debug.logger.info('Controller: Products created successfully', { data: products });
      res.status(201).json({ success: true, data: products });
    } catch (error) {
      debug.logger.error('Controller: Error creating products in bulk', { error });
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const query = req.query.q;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter "q" is required and must be a string.' });
      }
      const trimmedQuery = query.trim();
      if (trimmedQuery === '') {
        return res.status(400).json({ error: 'Query parameter "q" cannot be empty after trimming.' });
      }
      const products = await this.service.searchProducts(trimmedQuery);
      return res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async findByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const products = await this.service.findByCategory(category);
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      debug.logger.error('Controller: Error finding products by category', { error });
      next(error);
    }
  }
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await this.service.updateProduct(id, req.body);
      debug.logger.info('Controller: Product updated', { id });
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      debug.logger.error('Controller: Error updating product', { id, error });
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.deleteProduct(id);
      debug.logger.info('Controller: Product deleted', { id });
      res.status(204).end();
    } catch (error) {
      debug.logger.error('Controller: Error deleting product', { id, error });
      next(error);
    }
  }
}

export default ProductController;
