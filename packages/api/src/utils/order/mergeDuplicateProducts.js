/**
 * Mescla produtos duplicados em uma lista, somando suas quantidades.
 *
 * @param {Object[]} productList - Lista de produtos.
 * @param {string} productList[].product - ID do produto.
 * @param {number} productList[].quantity - Quantidade do produto.
 * @returns {Object[]} Lista de produtos únicos com as quantidades somadas.
 *
 * @example
 * const products = [
 *   { product: 'id1', quantity: 2 },
 *   { product: 'id1', quantity: 3 },
 *   { product: 'id2', quantity: 1 }
 * ];
 * const merged = mergeDuplicateProducts(products);
 * console.log(merged); // [{ product: 'id1', quantity: 5 }, { product: 'id2', quantity: 1 }]
 */
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
