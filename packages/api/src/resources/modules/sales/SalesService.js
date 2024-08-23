class SalesService {
  constructor(repository, productService) {
    this.repository = repository;
    this.productService = productService;
  }

  async createSale(salesData) {
    let totalPrice = 0;
    const updatedProducts = [];

    for (const item of salesData.products) {
      const product = await this.productService.getProduct(item.productId);

      if (!product) {
        throw new Error(`Produto com ID ${item.productId} não encontrado`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Quantidade insuficiente em estoque para o produto: ${product.name}`);
      }

      totalPrice += item.quantity * product.price;
      product.quantity -= item.quantity;
      await this.productService.modifyProduct(product._id, { quantity: product.quantity });

      updatedProducts.push({ product: product._id, quantity: item.quantity, price: product.price });
    }

    const sale = await this.repository.createSale({
      products: updatedProducts,
      totalPrice,
    });

    return sale;
  }

  async getSale(id) {
    const sale = await this.repository.findSaleById(id);

    if (!sale) {
      throw new Error('Venda não encontrada');
    }

    sale.products = sale.products.map((p) => ({
      ...p,
      product: { _id: p.product },
    }));

    return sale;
  }

  async getAllSales() {
    return await this.repository.findAllSales();
  }

  async updateSale(id, updateData) {
    const sale = await this.repository.updateSaleById(id, updateData);
    if (!sale) {
      throw new Error('Venda não encontrada para atualização');
    }
    return sale;
  }

  async deleteSale(id) {
    const result = await this.repository.deleteSaleById(id);

    if (!result) {
      throw new Error('Venda não encontrada para deleção');
    }
    return result;
  }
}

export default SalesService;
