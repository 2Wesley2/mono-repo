import BackStock from '../resources/entities/domain/stock/BackStock.js';

export default {
  checkStockLevel: (...args) => {
    console.debug('Wrapper - checkStockLevel called with arguments:', JSON.stringify(args, null, 2));
    const result = BackStock.checkStockLevel(...args);
    console.debug('Wrapper - checkStockLevel result:', JSON.stringify(result, null, 2));
    return result;
  },
};
