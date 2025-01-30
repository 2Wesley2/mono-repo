export default class BillService {
  constructor(repository) {
    this.repository = repository;
  }

  async createBill(data) {
    return await this.repository.createBill(data);
  }

  async bulkCreateBills(data) {
    return await this.repository.bulkCreate(data);
  }

  async updateBillProducts(ownerId, billNumber, updatedProducts) {
    return await this.repository.updateBillProducts(ownerId, billNumber, updatedProducts);
  }

  async getProductsByBill(ownerId, billNumber) {
    const products = await this.repository.getProductsByBill(ownerId, billNumber);
    return products;
  }
}
