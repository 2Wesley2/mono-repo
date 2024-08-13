class SalesRepository {
  constructor(model) {
    this.model = model;
  }

  async createSale(salesData) {
    return await this.model.create(salesData);
  }

  async findSaleById(id) {
    return await this.model.findById(id);
  }

  async findAllSales() {
    return await this.model.findAll();
  }
}

export default SalesRepository;
