import express from 'express';
import loaders from '../loaders/index.js';
import errorHandler from '../middlewares/errorHandler.js';

import ProductController from './modules/products/ProductController.js';
import ProductService from './modules/products/ProductService.js';
import ProductRepository from './modules/products/ProductRepository.js';
import ProductModel from './modules/products/ProductModel.js';

import SalesController from './modules/sales/SalesController.js';
import SalesService from './modules/sales/SalesService.js';
import SalesRepository from './modules/sales/SalesRepository.js';
import SalesModel from './modules/sales/SalesModel.js';

const app = express();

loaders.express.init(app);

// Instância do módulo de produtos
const productRepository = new ProductRepository(ProductModel);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Instância dos módulos de vendas
const salesRepository = new SalesRepository(SalesModel);
const salesService = new SalesService(salesRepository, productService);
const salesController = new SalesController(salesService);

// Rotas dos módulos
app.use('/api', productController.getRouter());
app.use('/api', salesController.getRouter());

app.get('/', (_, res) => res.json('Welcome to the SmartShop API'));

app.use(errorHandler);

export default app;
