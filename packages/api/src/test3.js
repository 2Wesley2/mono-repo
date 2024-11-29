import Database from './database/index.js';
import ProductModel from './resources/modules/product/ProductModel.js';
import ProductRepository from './resources/modules/product/ProductRepository.js';
import ProductService from './resources/modules/product/ProductService.js';

import OrderModel from './resources/modules/order/OrderModel.js';
import OrderRepository from './resources/modules/order/OrderRepository.js';
import OrderService from './resources/modules/order/OrderService.js';
import debug from './debug/index.js';

const test = async () => {
  let result = null;
  try {
    await Database.connect();
    console.log('Conectado ao banco de dados.');

    const productModel = new ProductModel();
    const productRepository = new ProductRepository(productModel);
    const productService = new ProductService(productRepository);

    const orderModel = new OrderModel();
    const orderRepository = new OrderRepository(orderModel);
    const orderService = new OrderService(orderRepository, productService);
    const orderNumber = 2;
    const updateProducts = [
      { product: '6745d9d3f7c376f561ad14ea', quantity: 15 },
      { product: '6745d9d3f7c376f561ad14eb', quantity: 4 },
      { product: '6745d9d3f7c376f561ad14ec', quantity: 2 },
      { product: '6745d9d3f7c376f561ad14fe', quantity: 5 },
    ];

    result = await orderService.updateOrderProducts(orderNumber, updateProducts);
    await Database.disconnect();
    console.log('Conexão encerrada.');
  } catch (err) {
    console.error('Erro durante o teste:', err);
  }
};

test();
