/**
 * Verifica se todos os IDs fornecidos existem em uma lista de produtos.
 *
 * @param {string[]} ids - Lista de IDs de produtos a verificar.
 * @param {Object[]} products - Lista de produtos existentes.
 * @param {string} products[].id - Identificador único do produto.
 * @returns {boolean} Retorna `true` se todos os IDs existirem, caso contrário `false`.
 *
 * @example
 * const ids = ['id1', 'id2'];
 * const products = [{ _id: 'id1' }, { _id: 'id2' }];
 * console.log(productsExistById(ids, products)); // true
 */
function productsExistById(ids, products) {
  const returnedIds = products.map((product) => product._id.toString());
  return ids.every((id) => returnedIds.includes(id));
}

export default productsExistById;
