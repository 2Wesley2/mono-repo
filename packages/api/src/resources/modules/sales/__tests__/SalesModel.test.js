import mongoose from 'mongoose';
import SalesModel from '../SalesModel.js';
import Database from '../../../../database/index.js';

// Definindo e registrando o esquema Product usando configSchema
const productSchema = Database.configSchema({
  schema: {
    name: String,
    price: Number,
    quantity: Number,
  },
});

const ProductModel = mongoose.model('Product', productSchema);

describe('SalesModel', () => {
  beforeAll(async () => {
    await Database.connect('test');
  });

  afterAll(async () => {
    await Database.disconnect();
  });

  afterEach(async () => {
    await SalesModel.Sales.deleteMany({});
    await ProductModel.deleteMany({});
  });

  it('should create a valid sales record', async () => {
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });

    const salesData = {
      productId: product._id,
      quantity: 2,
      totalPrice: 200,
    };

    const sale = await SalesModel.create(salesData);
    expect(sale).toHaveProperty('_id');
    expect(sale.productId.toString()).toBe(salesData.productId.toString());
    expect(sale.quantity).toBe(2);
    expect(sale.totalPrice).toBe(200);
    expect(sale.createdAt).toBeDefined();
  });

  it('should find a sale by ID', async () => {
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });

    const salesData = {
      productId: product._id,
      quantity: 2,
      totalPrice: 200,
    };

    const createdSale = await SalesModel.create(salesData);
    const foundSale = await SalesModel.findById(createdSale._id);

    expect(foundSale).toBeTruthy();
    expect(foundSale.productId._id.toString()).toBe(product._id.toString());
  });

  it('should find all sales', async () => {
    const product1 = await ProductModel.create({
      name: 'Product 1',
      price: 100,
      quantity: 10,
    });

    const product2 = await ProductModel.create({
      name: 'Product 2',
      price: 150,
      quantity: 5,
    });

    await SalesModel.create({
      productId: product1._id,
      quantity: 2,
      totalPrice: 200,
    });

    await SalesModel.create({
      productId: product2._id,
      quantity: 3,
      totalPrice: 450,
    });

    const sales = await SalesModel.findAll();
    expect(sales).toHaveLength(2);
  });
});
