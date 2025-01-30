export default class BillService {
  constructor(repository) {
    this.repository = repository;
  }

  async updateOrderProducts(orderNumber, updateOrderProductsFields) {}

  async listProductsByOrder(orderNumber) {}
}
