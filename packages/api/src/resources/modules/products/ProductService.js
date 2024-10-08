import mongoose from 'mongoose';
import AppError from '../../../errors/AppError.js';

class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'ID de produto inválido.');
    }
  }

  async createProduct(productData) {
    const count = await this.repository.count({
      name: productData.name,
      category: productData.category,
    });

    if (count > 0) {
      throw new AppError(400, 'Produto já existe nessa categoria.');
    }

    return await this.repository.create(productData);
  }

  async getProductById(id) {
    this.validateObjectId(id);

    const product = await this.repository.findById(id);

    if (!product) {
      throw new AppError(404, 'Produto não encontrado.');
    }

    return product;
  }

  async getAllProducts(filters = {}, options = {}) {
    return await this.repository.findAll(filters, options);
  }

  async updateProduct(id, updateData) {
    this.validateObjectId(id);

    const updatedProduct = await this.repository.update(id, updateData);

    if (!updatedProduct) {
      throw new AppError(404, 'Produto não encontrado para atualização.');
    }

    return updatedProduct;
  }

  async deleteProduct(id) {
    this.validateObjectId(id);

    const deletedProduct = await this.repository.delete(id);

    if (!deletedProduct) {
      throw new AppError(404, 'Produto não encontrado para remoção.');
    }

    return;
  }
}

export default ProductService;
