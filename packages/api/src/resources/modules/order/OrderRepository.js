import debug from '../../../debug/index.js';
/**
 * Classe responsável por interagir com o modelo de pedidos (OrderModel).
 * Centraliza a lógica de repositório e facilita o gerenciamento de dados de pedidos.
 * @class OrderRepository
 */
class OrderRepository {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async createOrder(data) {
    return await this.orderModel.createOrder(data);
  }

  async bulkCreate(data) {
    return await this.orderModel.bulkCreate(data);
  }
  async updateOrderProducts(currentOrder, updateOrderProductsFields) {
    const currentOrderId = currentOrder._id;
    const updatedProducts = currentOrder.products.reduce((acc, product) => {
      const updatedProduct = updateOrderProductsFields.find(
        (uProd) => String(uProd.product) === String(product.product),
      );

      if (updatedProduct) {
        if (updatedProduct.quantity <= 0) {
          return acc;
        }
        return [
          ...acc,
          {
            ...product,
            quantity: updatedProduct.quantity,
          },
        ];
      }
      return [...acc, product];
    }, []);

    const newProducts = updateOrderProductsFields
      .filter(
        (newProd) =>
          !currentOrder.products.some((existingProd) => String(existingProd.product) === String(newProd.product)) &&
          newProd.quantity > 0,
      )
      .map((newProd) => ({
        product: newProd.product,
        quantity: newProd.quantity,
      }));
    const finalProducts = [...updatedProducts, ...newProducts];
    return await this.orderModel.updateOrderProducts(finalProducts, currentOrderId);
  }

  async findByOrderNumber(orderNumber) {
    const result = await this.orderModel.findByOrderNumber(orderNumber);
    return result;
  }

  async listProductsByOrder(orderNumber) {
    const products = await this.orderModel.listProductsByOrder(orderNumber);
    return products;
  }
}

export default OrderRepository;
