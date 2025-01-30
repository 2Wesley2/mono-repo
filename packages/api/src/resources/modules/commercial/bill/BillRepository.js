export default class BillRepository {
  constructor(model) {
    this.model = model;
  }

  async createBill(data) {
    return await this.model.createBill(data);
  }

  async bulkCreateBills(data) {
    return await this.model.bulkCreate(data);
  }

  async updateBillProducts(ownerId, billNumber, updatedProducts) {
    return await this.model.updateBillProducts(ownerId, billNumber, updatedProducts);
  }

  async getProductsByBill(ownerId, billNumber) {
    const products = await this.model.getProductsByBill(ownerId, billNumber);
    return products;
  }
}
