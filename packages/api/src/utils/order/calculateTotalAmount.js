import debug from '../../debug/index.js';

function calculateTotalAmount(getExistingProducts, updatedProducts, currentOrderTotalAmount, currentOrderProducts) {
  try {
    debug.logger.superdebug('getExistingProducts:', getExistingProducts);
    debug.logger.superdebug('updatedProducts:', updatedProducts);
    debug.logger.superdebug('currentOrderTotalAmount:', currentOrderTotalAmount);
    debug.logger.superdebug('currentOrderProducts:', currentOrderProducts);
    const productMap = new Map(getExistingProducts.map((prod) => [prod._id.toString(), prod]));
    debug.logger.superdebug('productMap:', [...productMap.entries()]);
    const currentOrderMap = new Map(currentOrderProducts.map((prod) => [prod.product.toString(), prod.quantity]));
    const updatedProductsTotal = updatedProducts.reduce((acc, item) => {
      const product = productMap.get(item.product.toString());
      debug.logger.superdebug('productMap.get:', { productId: item.product, result: product });

      if (product) {
        const currentQuantity = currentOrderMap.get(item.product.toString()) || 0;

        if (item.quantity !== currentQuantity) {
          const quantityDifference = item.quantity - currentQuantity;
          const productTotal = product.price * quantityDifference;
          acc += productTotal;

          debug.logger.superdebug('Atualizando total:', {
            product: product.name,
            quantityDifference,
            productTotal,
            acc,
          });
        } else {
          debug.logger.superdebug('Produto inalterado, ignorado:', {
            product: product.name,
            currentQuantity,
            newQuantity: item.quantity,
          });
        }
      } else {
        debug.logger.superdebug('Produto não encontrado no mapa:', { productId: item.product });
      }

      return acc;
    }, 0);

    const totalAmount = currentOrderTotalAmount + updatedProductsTotal;

    debug.logger.superdebug('updatedProductsTotal:', updatedProductsTotal);
    debug.logger.superdebug('totalAmount:', totalAmount);
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
