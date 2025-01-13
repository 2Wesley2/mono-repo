export default class Stock {
  static createProductUpdateOperation(idStock, productId, delta) {
    return {
      updateOne: {
        filter: { _id: idStock, 'products.product': productId },
        update: { $inc: { 'products.$.quantity': delta } },
      },
    };
  }

  static formatStockData(stockData, productsDetails) {
    const products = stockData.products.map((product) => {
      const productDetail = productsDetails.find((p) => p._id.toString() === product.product.toString());

      return {
        productId: product.product.toString(),
        productName: productDetail?.name || 'Unknown',
        quantity: product.quantity,
        price: productDetail?.price || 0,
      };
    });

    const quantityProducts = products.reduce((sum, p) => sum + p.quantity, 0);
    const valueTotal = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

    return { products, quantityProducts, valueTotal };
  }

  static aggregateStockData(stockArray) {
    return stockArray.reduce(
      (acc, curr) => ({
        products: [...acc.products, ...curr.products],
        quantityProducts: acc.quantityProducts + curr.quantityProducts,
        valueTotal: acc.valueTotal + curr.valueTotal,
      }),
      { products: [], quantityProducts: 0, valueTotal: 0 },
    );
  }

  static mergeStockData(backStockData, showRoomData) {
    const mergedProducts = [...backStockData.products, ...showRoomData.products].reduce((acc, product) => {
      const key = product.productId;
      acc[key] = acc[key] || { ...product, quantity: 0 };
      acc[key].quantity += product.quantity;
      return acc;
    }, {});

    const products = Object.values(mergedProducts);
    const quantityProducts = products.reduce((sum, p) => sum + p.quantity, 0);
    const valueTotal = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

    return { products, quantityProducts, valueTotal };
  }
}
