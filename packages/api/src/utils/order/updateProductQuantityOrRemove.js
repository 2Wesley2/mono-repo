function updateProductQuantityOrRemove(order, productIndex) {
  const productData = order.products[productIndex];

  if (productData.quantity > 1) {
    productData.quantity -= 1;
  } else {
    order.products.splice(productIndex, 1);
  }
}
export default updateProductQuantityOrRemove;
