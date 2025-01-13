import loaders from '../../../loaders/index.js';
const emptyStock = [{ productId: 'null', productName: 'null', totalQuantity: 0 }];

export default class StockRepository {
  constructor(model) {
    this.model = model;
  }

  async stockSummary() {
    try {
      const stock = await this.model.findOne().populate(['backStock.product', 'showRoom.product']);
      if (!stock) return { backStock: {}, showRoom: {}, stock: {} };

      // Função para criar o resumo de uma categoria (backStock ou showRoom)
      const createCategorySummary = (category) => {
        const products = category.map(({ product, quantity }) => ({
          productId: product._id.toString(),
          productName: product.name,
          quantity,
          price: product.price || 0,
        }));

        const quantityProducts = products.reduce((acc, p) => acc + p.quantity, 0);
        const valueTotal = products.reduce((acc, p) => acc + p.quantity * p.price, 0);

        return { products, quantityProducts, valueTotal };
      };

      const backStockSummary = createCategorySummary(stock.backStock);
      const showRoomSummary = createCategorySummary(stock.showRoom);

      const combinedProductsMap = new Map();

      backStockSummary.products.forEach((product) => {
        if (combinedProductsMap.has(product.productId)) {
          const existing = combinedProductsMap.get(product.productId);
          existing.quantity += product.quantity;
        } else {
          combinedProductsMap.set(product.productId, { ...product });
        }
      });

      showRoomSummary.products.forEach((product) => {
        if (combinedProductsMap.has(product.productId)) {
          const existing = combinedProductsMap.get(product.productId);
          existing.quantity += product.quantity;
        } else {
          combinedProductsMap.set(product.productId, { ...product });
        }
      });

      const combinedProducts = Array.from(combinedProductsMap.values());
      const totalQuantity = combinedProducts.reduce((acc, p) => acc + p.quantity, 0);
      const totalValue = combinedProducts.reduce((acc, p) => acc + p.quantity * p.price, 0);

      const stockSummary = {
        products: combinedProducts,
        quantityProducts: totalQuantity,
        valueTotal: totalValue,
      };

      return {
        backStock: backStockSummary,
        showRoom: showRoomSummary,
        stock: stockSummary,
      };
    } catch (error) {
      throw new Error(`Erro ao gerar resumo do estoque: ${error.message}`);
    }
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
