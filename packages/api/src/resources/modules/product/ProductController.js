import Controller from '../../../resources/core/Controller.js';
import debug from '../../../debug/index.js';

class ProductController extends Controller {
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  initializeCustomRoutes() {
    this.router.post('/', this.create.bind(this));
    this.router.post('/bulk', this.bulkCreate.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.delete.bind(this));
    this.router.get('/category/:category', this.findByCategory.bind(this));
  }

  async create(req, res, next) {
    try {
      const product = await this.service.create(req.body);
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
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await this.service.update(id, req.body);
      debug.logger.info('Controller: Product updated', { id });
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      debug.logger.error('Controller: Error updating product', { id, error });
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      debug.logger.info('Controller: Product deleted', { id });
      res.status(204).end();
    } catch (error) {
      debug.logger.error('Controller: Error deleting product', { id, error });
      next(error);
    }
  }
}

export default ProductController;
