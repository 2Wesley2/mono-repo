import Stock from './Stock.js';

export default class BackStock extends Stock {
  static checkStockLevel(productId, quantity, currentStock) {
    console.debug('checkStockLevel - Input productId type:', typeof productId, 'productId:', productId);
    console.debug('checkStockLevel - Input quantity type:', typeof quantity, 'quantity:', quantity);
    console.debug(
      'checkStockLevel - Input currentStock type:',
      typeof currentStock,
      'currentStock structure:',
      JSON.stringify(currentStock, null, 2),
    );

    const product = currentStock.find((item) => item.product === productId);

    const result = product && product.quantity >= quantity;
    console.debug('checkStockLevel - Output type:', typeof result, 'result:', result);

    return result;
  }
}
