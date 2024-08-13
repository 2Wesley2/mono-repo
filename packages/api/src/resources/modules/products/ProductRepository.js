class ProductRepository {
  constructor(model) {
    this.model = model;
  }

  async createProduct(productData) {
    return await this.model.create(productData);
  }

  async findProductById(id) {
    return await this.model.findById(id);
  }

  async updateProduct(id, productData) {
    return await this.model.update(id, productData);
  }

  async deleteProduct(id) {
    return await this.model.delete(id);
  }
}

export default ProductRepository;
