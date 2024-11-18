import AppError from '../../errors/AppError.js';

/**
 * Valida a existência de uma comanda (order) e de um produto (product).
 * Lança um erro se qualquer um deles não existir.
 *
 * @param {Object} order - A comanda que será validada.
 * @param {Object} product - O produto que será validado.
 */
function validateOrderAndProductExistence({ order, product }) {
  if (!order) {
    throw new AppError(404, 'Order does not exist.');
  }

  if (!product) {
    throw new AppError(404, `Product with ID ${product} does not exist.`);
  }
}

export default validateOrderAndProductExistence;
