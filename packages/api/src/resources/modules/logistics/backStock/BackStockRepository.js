import loaders from '../../../../core/loaders/index.js';
const emptyStock = [{ productId: 'null', productName: 'null', totalQuantity: 0 }];

export default class BackStockRepository {
  constructor(model) {
    this.model = model;
  }
}

const o = {
  backStock: {
    products: [
      {
        productId: '63d2f4471c4e88f9a334d4e7',
        productName: 'Produto A',
        quantity: 13,
        price: 2,
      },
      {
        productId: '63d2f4471c4e88f9a334d4e8',
        productName: 'Produto B',
        quantity: 5,
        price: 2,
      },
    ],
    quantityProducts: 18,
    valueTotal: 36,
  },
  showRoom: {
    products: [
      {
        productId: '63d2f4471c4e88f9a334d4e7',
        productName: 'Produto A',
        quantity: 13,
        price: 2,
      },
      {
        productId: '63d2f4471c4e88f9a334d4e8',
        productName: 'Produto B',
        quantity: 5,
        price: 2,
      },
    ],
    quantityProducts: 18,
    valueTotal: 36,
  },
  stock: {
    products: [
      {
        productId: '63d2f4471c4e88f9a334d4e7',
        productName: 'Produto A',
        quantity: 26,
        price: 2,
      },
      {
        productId: '63d2f4471c4e88f9a334d4e8',
        productName: 'Produto B',
        quantity: 10,
        price: 2,
      },
    ],
    quantityProducts: 36,
    valueTotal: 72,
  },
};
