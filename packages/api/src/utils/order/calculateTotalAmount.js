function calculateTotalAmount(getExistingProducts, updatedProducts) {
  const productMap = new Map(getExistingProducts.map((prod) => [prod._id, prod]));
  const totalAmount = updatedProducts.reduce((acc, item) => {
    const product = productMap.get(item.product);
    if (product) {
      acc += product.price * item.quantity;
    }
    return acc;
  }, 0);

  return totalAmount;
}
export default calculateTotalAmount;
