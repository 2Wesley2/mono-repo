function mergeDuplicateProducts(productList) {
  const uniqueProducts = {};
  productList.forEach((item) => {
    const { product, quantity } = item;
    if (uniqueProducts[product]) {
      uniqueProducts[product] += quantity;
    } else {
      uniqueProducts[product] = quantity;
    }
  });

  return Object.entries(uniqueProducts).map(([product, quantity]) => ({
    product,
    quantity,
  }));
}
export default mergeDuplicateProducts;
