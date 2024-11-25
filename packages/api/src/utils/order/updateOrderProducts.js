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
