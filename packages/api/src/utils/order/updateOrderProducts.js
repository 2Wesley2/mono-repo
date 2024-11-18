function updateOrderProducts({ order, productData }) {
  const existingProductIndex = order.products.findIndex((p) => p.product.toString() === productData.product);

  if (existingProductIndex !== -1) {
    // Produto já existe, incrementa a quantidade
    order.products[existingProductIndex].quantity += productData.quantity;
  } else {
    // Produto não existe, adiciona à lista
    order.products.push(productData);
  }
}
export default updateOrderProducts;
