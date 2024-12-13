/**
 * Extrai os IDs dos produtos de uma lista de objetos de produtos.
 *
 * @param {Object[]} data - Lista de objetos representando produtos, contendo pelo menos uma propriedade `product`.
 * @returns {string[]} Lista de IDs de produtos extraídos.
 *
 * @example
 * const products = [
 *   { product: 'productId1', quantity: 2 },
 *   { product: 'productId2', quantity: 5 }
 * ];
 * const productIds = extractedProductIds(products);
 * console.log(productIds); // ['productId1', 'productId2']
 */
function extractedProductIds(data) {
  return data.map((item) => item.product);
}
export default extractedProductIds;
