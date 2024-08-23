class SalesRepository {
  constructor(model) {
    this.model = model;
  }

  async createSale(salesData) {
    console.log('Saving sale with data:', salesData);
    const sale = await this.model.create(salesData);
    const savedSale = await this.model.findById(sale._id);
    console.log('Sale saved and retrieved:', savedSale);
    return savedSale;
  }

  async findSaleById(id) {
    return await this.model.findById(id);
  }

  async findAllSales() {
    return await this.model.find();
  }

  async updateSaleById(id, updateData) {
    return await this.model.updateById(id, updateData);
  }

  async deleteSaleById(id) {
    return await this.model.deleteById(id);
  }
}

export default SalesRepository;
