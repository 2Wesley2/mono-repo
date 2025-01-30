export default class BillRepository {
  constructor(model) {
    this.model = model;
  }

  async createBill(data) {
    return await this.orderModel.createOrder(data);
  }

  async bulkCreate(data) {
    return await this.orderModel.bulkCreate(data);
  }

  async updateBillProducts(ownerId, finalProducts, totalAmount) {
    return await this.orderModel.updateOrderProducts(ownerId, finalProducts, totalAmount);
  }

  async listProductsByOrder(orderNumber) {
    const products = await this.orderModel.listProductsByOrder(orderNumber);
    return products;
  }
}
