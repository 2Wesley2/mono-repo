import Stock from './Stock.js';

export default class ShowRoom extends Stock {
  static displayStockLevel(productId, currentStock) {
    console.debug('displayStockLevel - Input productId type:', typeof productId, 'productId:', productId);
    console.debug(
      'displayStockLevel - Input currentStock type:',
      typeof currentStock,
      'currentStock structure:',
      JSON.stringify(currentStock, null, 2),
    );

    const product = currentStock.find((item) => item.product === productId);

    const result = product;
    console.debug('displayStockLevel - Output type:', typeof result, 'result:', result);

    return result;
  }
}
