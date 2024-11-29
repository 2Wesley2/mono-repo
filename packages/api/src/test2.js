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

const productList = [
  { product: '6745d9d3f7c376f561ad14ea', quantity: 576 },
  { product: '6745d9d3f7c376f561ad14eb', quantity: 128 },
  { product: '6745d9d3f7c376f561ad14ec', quantity: 128 },
];

const result = mergeDuplicateProducts(productList);
console.log(result);
