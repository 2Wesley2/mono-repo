import mongoose from 'mongoose';
import SalesModel from '../SalesModel.js';
import Database from '../../../../database/index.js';

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

  beforeEach(async () => {
    await SalesModel.Sales.deleteMany({});
    await ProductModel.deleteMany({});
    const salesCount = await SalesModel.Sales.countDocuments();
    const productCount = await ProductModel.countDocuments();
    expect(salesCount).toBe(0);
    expect(productCount).toBe(0);
  });

  it('should create a valid sales record with multiple products', async () => {
    const product1 = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });

    const product2 = await ProductModel.create({
      name: 'Test Product 2',
      price: 150,
      quantity: 5,
    });

    const salesData = {
      products: [
        { product: product1._id, quantity: 2, price: 100 },
        { product: product2._id, quantity: 3, price: 150 },
      ],
      totalPrice: 650,
    };

    const sale = await SalesModel.create(salesData);
    console.log('Sale created:', sale);
    console.log('Created At:', sale.createdAt);
    expect(sale).toHaveProperty('_id');
    expect(sale.products).toHaveLength(2);
    expect(sale.products[0].product.toString()).toBe(product1._id.toString());
    expect(sale.products[0].quantity).toBe(2);
    expect(sale.products[0].price).toBe(100);
    expect(sale.products[1].product.toString()).toBe(product2._id.toString());
    expect(sale.products[1].quantity).toBe(3);
    expect(sale.products[1].price).toBe(150);
    expect(sale.createdAt).toBeDefined();
  });

  it('should find a sale by ID and populate products', async () => {
    const product1 = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });

    const product2 = await ProductModel.create({
      name: 'Test Product 2',
      price: 150,
      quantity: 5,
    });

    const salesData = {
      products: [
        { product: product1._id, quantity: 2, price: 100 },
        { product: product2._id, quantity: 3, price: 150 },
      ],
      totalPrice: 650,
    };

    const createdSale = await SalesModel.create(salesData);
    const foundSale = await SalesModel.findById(createdSale._id);

    expect(foundSale).toBeTruthy();
    expect(foundSale.products).toHaveLength(2);
    expect(foundSale.products[0].product._id.toString()).toBe(product1._id.toString());
    expect(foundSale.products[1].product._id.toString()).toBe(product2._id.toString());
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

    await SalesModel.Sales.deleteMany({});

    await SalesModel.create({
      products: [{ product: product1._id, quantity: 2, price: 100 }],
      totalPrice: 200,
    });

    await SalesModel.create({
      products: [{ product: product2._id, quantity: 3, price: 150 }],
      totalPrice: 450,
    });

    const sales = await SalesModel.find();
    expect(sales).toHaveLength(2);
  });
});
