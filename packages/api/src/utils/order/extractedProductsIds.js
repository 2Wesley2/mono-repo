/**
 * Extrai os IDs dos produtos de uma lista de objetos.
 *
 * @param {Object[]} data - Lista de objetos contendo IDs dos produtos.
 * @param {string} data[].product - ID do produto.
 * @returns {string[]} Lista de IDs extraídos dos produtos.
 *
 * @example
 * const data = [{ product: 'id1' }, { product: 'id2' }];
 * console.log(extractedProductIds(data)); // ['id1', 'id2']
 */
function extractedProductIds(data) {
  return data.map((item) => item.product);
}
export default extractedProductIds;
