/**
 * Verifica se todos os IDs fornecidos existem em uma lista de produtos retornados.
 *
 * @param {string[]} ids - Lista de IDs de produtos a serem verificados.
 * @param {Object[]} products - Lista de objetos representando produtos existentes, contendo pelo menos uma propriedade `_id`.
 * @returns {boolean} Retorna `true` se todos os IDs forem encontrados, caso contrário, `false`.
 *
 * @example
 * const ids = ['productId1', 'productId2'];
 * const products = [
 *   { _id: 'productId1', name: 'Produto A' },
 *   { _id: 'productId2', name: 'Produto B' }
 * ];
 * const result = productsExistById(ids, products);
 * console.log(result); // true
 */
function productsExistById(ids, products) {
  const returnedIds = products.map((product) => product._id.toString());
  return ids.every((id) => returnedIds.includes(id));
}

export default productsExistById;
