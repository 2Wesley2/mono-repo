import Stock from '../resources/entities/domain/stock/Stock.js';

export default {
  createProductUpdateOperation: (...args) => Stock.createProductUpdateOperation(...args),
  formatStockData: (...args) => Stock.formatStockData(...args),
  aggregateStockData: (...args) => Stock.aggregateStockData(...args),
  mergeStockData: (...args) => Stock.mergeStockData(...args),
};
