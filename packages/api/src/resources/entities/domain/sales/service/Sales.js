export default class Sales {
  static toArray(value) {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  }

  static isValidSaleFormat(sale) {
    return (
      typeof sale === 'object' &&
      sale !== null &&
      'salesType' in sale &&
      typeof sale.salesType === 'string' &&
      'items' in sale &&
      Array.isArray(sale.items) &&
      'amount' in sale &&
      typeof sale.amount === 'number'
    );
  }

  static countSales(salesArray) {
    salesArray = this.toArray(salesArray);
    const sales = salesArray.reduce((acc, sale, index) => {
      if (!this.isValidSaleFormat(sale)) {
        throw new Error(`Formato inválido\n  objeto inválido:\n   ${JSON.stringify(salesArray[index])}`);
      }
      return acc + 1;
    }, 0);
    return sales;
  }

  static amountBySale(salesArray) {
    salesArray = this.toArray(salesArray);
    const amountBySales = salesArray.reduce((sale) => {
      if (!this.isValidSaleFormat(sale)) {
        throw new Error(`Formato inválido\n  objeto inválido:\n   ${JSON.stringify(salesArray[index])}`);
      }
      return sale.amount;
    });
    return amountBySales;
  }
}
