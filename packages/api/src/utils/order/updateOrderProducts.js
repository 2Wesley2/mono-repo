/**
 * Atualiza os produtos de uma comanda existente com base nos dados fornecidos.
 *
 * @param {Object} params - Parâmetros necessários para a atualização.
 * @param {Object} params.order - Objeto representando a comanda.
 * @param {Object[]} params.order.products - Lista de produtos na comanda.
 * @param {string} params.productId - ID do produto a ser atualizado.
 * @param {Object} params.productData - Dados do produto a ser adicionado/atualizado.
 * @param {number} params.productData.quantity - Quantidade do produto.
 *
 * @example
 * const order = { products: [{ product: 'id1', quantity: 2 }] };
 * updateOrderProducts({ order, productData: { quantity: 3 }, productId: 'id1' });
 * console.log(order);
 */
function updateOrderProducts({ order, productData, productId }) {
  const existingProductIndex = order.products.findIndex((p) => p.product.toString() === productId);

  if (existingProductIndex !== -1) {
    // Atualiza a quantidade do produto existente
    order.products[existingProductIndex].quantity += productData.quantity;
  } else {
    // Adiciona o produto à lista
    order.products.push({ product: productId, quantity: productData.quantity });
  }
}

export default updateOrderProducts;
