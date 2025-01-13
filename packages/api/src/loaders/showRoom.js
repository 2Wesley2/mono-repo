import ShowRoom from '../resources/entities/domain/stock/ShowRoom.js';

export default {
  displayStockLevel: (...args) => {
    console.debug('Wrapper - displayStockLevel called with arguments:', JSON.stringify(args, null, 2));
    const result = ShowRoom.displayStockLevel(...args);
    console.debug('Wrapper - displayStockLevel result:', JSON.stringify(result, null, 2));
    return result;
  },
};
