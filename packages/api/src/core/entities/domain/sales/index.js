import Sales from './Sales';
export default {
  count: (...args) => Sales.countSales(...args),
  amountBySale: (...args) => Sales.amountBySale(...args)
};
