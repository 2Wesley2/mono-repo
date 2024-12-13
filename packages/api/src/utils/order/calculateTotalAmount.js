/**
 * Calcula o valor total atualizado de uma comanda após alterações nos produtos.
 *
 * Este método considera as mudanças nas quantidades de produtos existentes e
 * a remoção de produtos da comanda para calcular o novo valor total.
 *
 * @param {Object[]} getExistingProducts - Lista de produtos existentes no sistema, com detalhes como preço.
 * @property {string} getExistingProducts[].id - Identificador único do produto.
 * @property {number} getExistingProducts[].price - Preço do produto.
 * @param {Object[]} updatedProducts - Produtos atualizados na comanda.
 * @property {string} updatedProducts[].product - ID do produto.
 * @property {number} updatedProducts[].quantity - Nova quantidade do produto.
 * @param {number} currentOrderTotalAmount - Valor total atual da comanda.
 * @param {Object[]} currentOrderProducts - Produtos associados à comanda atual.
 * @property {string} currentOrderProducts[].product - ID do produto na comanda.
 * @property {number} currentOrderProducts[].quantity - Quantidade do produto na comanda.
 * @returns {number} Retorna o valor total atualizado da comanda.
 * @example
 * const total = calculateTotalAmount(existingProducts, updatedProducts, 100, currentOrderProducts);
 * console.log(total); // Exibe o valor total atualizado da comanda.
 */

function calculateTotalAmount(getExistingProducts, updatedProducts, currentOrderTotalAmount, currentOrderProducts) {
  try {
    // Mapeia os produtos existentes para facilitar consultas rápidas por ID.
    const productMap = new Map(getExistingProducts.map((prod) => [prod._id.toString(), prod]));
    const currentOrderMap = new Map(currentOrderProducts.map((prod) => [prod.product.toString(), prod.quantity]));

    let updatedProductsTotal = 0;

    // Calcula o impacto das atualizações de quantidade nos produtos.
    updatedProducts.forEach((item) => {
      const product = productMap.get(item.product.toString());
      if (product) {
        const currentQuantity = currentOrderMap.get(item.product.toString()) || 0;
        const quantityDifference = item.quantity - currentQuantity;

        if (quantityDifference !== 0) {
          const productTotal = product.price * quantityDifference;
          updatedProductsTotal += productTotal;
        }
      }
    });

    // Subtrai o valor dos produtos removidos da comanda.
    currentOrderProducts.forEach((product) => {
      const isRemoved = !updatedProducts.some((updatedProd) => String(updatedProd.product) === String(product.product));

      if (isRemoved) {
        const productDetails = productMap.get(product.product.toString());
        if (productDetails) {
          const removedTotal = productDetails.price * product.quantity;
          updatedProductsTotal -= removedTotal;
        }
      }
    });

    // Calcula o valor total atualizado da comanda.
    const totalAmount = currentOrderTotalAmount + updatedProductsTotal;
    return totalAmount;
  } catch (error) {
    // Trata erros capturados durante o cálculo.
    console.group('Erro Capturado');
    console.error('Mensagem de erro:', error.message);
    console.error('Stack Trace:', error.stack);
    console.groupEnd();
    return currentOrderTotalAmount;
  }
}
export default calculateTotalAmount;
