class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  async addProduct(productData) {
    return await this.repository.createProduct(productData);
  }

  async getProduct(id) {
    return await this.repository.findProductById(id);
  }

  async modifyProduct(id, productData) {
    return await this.repository.updateProduct(id, productData);
  }

  async removeProduct(id) {
    return await this.repository.deleteProduct(id);
  }
}

export default ProductService;
