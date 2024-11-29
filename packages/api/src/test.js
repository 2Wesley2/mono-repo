import Database from './database/index.js';
import OrderModel from './resources/modules/order/OrderModel.js';
import OrderRepository from './resources/modules/order/OrderRepository.js';
import OrderService from './resources/modules/order/OrderService.js';

import ProductService from './resources/modules/product/ProductService.js';
import ProductModel from './resources/modules/product/ProductModel.js';
import ProductRepository from './resources/modules/product/ProductRepository.js';
import debug from './debug/index.js';

const test = async () => {
  let result = null;
  try {
    await Database.connect();
    console.log('Conectado ao banco de dados.');
    const ids = [
      '6745d9d3f7c376f561ad14ea',
      '6745d9d3f7c376f561ad14eb',
      '6745d9d3f7c376f561ad14ec',
      '6745d9d3f7c376f561ad14fe',
    ];
    const productModel = new ProductModel();
    const productRepository = new ProductRepository(productModel);
    const productService = new ProductService(productRepository);

    const orderModel = new OrderModel();
    const orderRepository = new OrderRepository(orderModel);
    const orderService = new OrderService(orderRepository, productService);

    // const orderNumber = 2;
    result = await orderService.getProductsByIds(ids);
    console.log(JSON.stringify(result));
    await Database.disconnect();
    console.log('Conexão encerrada.');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  }
};

test();
