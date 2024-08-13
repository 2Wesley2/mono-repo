class SalesService {
  constructor(repository, productService) {
    this.repository = repository;
    this.productService = productService;
  }

  async createSale(salesData) {
    const product = await this.productService.getProduct(salesData.productId);

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (product.quantity < salesData.quantity) {
      throw new Error('Quantidade em estoque insuficiente');
    }

    const totalPrice = salesData.quantity * product.price;
    const sale = await this.repository.createSale({ ...salesData, totalPrice });

    // Atualizar a quantidade de produtos em estoque
    product.quantity -= salesData.quantity;
    await this.productService.modifyProduct(product._id, { quantity: product.quantity });

    return sale;
  }

  async getSale(id) {
    return await this.repository.findSaleById(id);
  }

  async getAllSales() {
    return await this.repository.findAllSales();
  }
}

export default SalesService;
