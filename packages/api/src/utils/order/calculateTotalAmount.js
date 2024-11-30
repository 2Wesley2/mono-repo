import debug from '../../debug/index.js';
function calculateTotalAmount(getExistingProducts, updatedProducts, currentOrderTotalAmount, currentOrderProducts) {
  try {
    const productMap = new Map(getExistingProducts.map((prod) => [prod._id.toString(), prod]));
    const currentOrderMap = new Map(currentOrderProducts.map((prod) => [prod.product.toString(), prod.quantity]));

    let updatedProductsTotal = 0;
    updatedProducts.forEach((item) => {
      const product = productMap.get(item.product.toString());
      if (product) {
        const currentQuantity = currentOrderMap.get(item.product.toString()) || 0;
        const quantityDifference = item.quantity - currentQuantity;

        if (quantityDifference !== 0) {
          const productTotal = product.price * quantityDifference;
          updatedProductsTotal += productTotal;

          debug.logger.superdebug('Atualizando total:', {
            product: product.name,
            quantityDifference,
            productTotal,
            updatedProductsTotal,
          });
        }
      }
    });

    currentOrderProducts.forEach((product) => {
      const isRemoved = !updatedProducts.some((updatedProd) => String(updatedProd.product) === String(product.product));

      if (isRemoved) {
        const productDetails = productMap.get(product.product.toString());
        if (productDetails) {
          const removedTotal = productDetails.price * product.quantity;
          updatedProductsTotal -= removedTotal;

          debug.logger.superdebug('Produto removido, ajustando total:', {
            product: productDetails.name,
            removedTotal,
            updatedProductsTotal,
          });
        }
      }
    });

    const totalAmount = currentOrderTotalAmount + updatedProductsTotal;
    return totalAmount;
  } catch (error) {
    console.group('Erro Capturado');
    console.error('Mensagem de erro:', error.message);
    console.error('Stack Trace:', error.stack);
    console.groupEnd();

    debug.logger.superdebug('Erro ao calcular o total:', {
      message: error.message,
      stack: error.stack,
    });

    return currentOrderTotalAmount;
  }
}
export default calculateTotalAmount;
