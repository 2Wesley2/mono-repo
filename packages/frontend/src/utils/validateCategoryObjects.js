/**
 * Valida se todos os objetos em cada categoria seguem o padrão de chaves esperadas.
 * @param {Object} categorizedProducts - Objeto com produtos categorizados.
 * @param {Array<string>} expectedKeys - Lista de chaves esperadas.
 * @returns {Object|boolean} - Retorna true se todos os objetos forem válidos; caso contrário, retorna os objetos inválidos.
 */
function validateCategoryObjects(categorizedProducts, expectedKeys) {
  const invalidEntries = Object.entries(categorizedProducts).reduce(
    (acc, [category, products]) => {
      const invalidObjects = products
        .map((product, index) => {
          const productKeys = Object.keys(product);
          const missingKeys = expectedKeys.filter(
            (key) => !productKeys.includes(key),
          );
          const extraKeys = productKeys.filter(
            (key) => !expectedKeys.includes(key),
          );

          return missingKeys.length || extraKeys.length
            ? {
                category,
                index,
                productId: product._id || null,
                missingKeys,
                extraKeys,
              }
            : null;
        })
        .filter((item) => item !== null);

      return [...acc, ...invalidObjects];
    },
    [],
  );

  return invalidEntries.length === 0 ? true : invalidEntries;
}
export default validateCategoryObjects;
