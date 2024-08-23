import mongoose from 'mongoose';
import SalesService from '../SalesService.js';
import SalesRepository from '../SalesRepository.js';
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

describe('SalesService', () => {
  let salesService;
  let salesRepository;

  beforeAll(async () => {
    console.log('Connecting to the database...');
    await Database.connect('test');
    salesRepository = new SalesRepository(SalesModel);
    salesService = new SalesService(salesRepository, {
      getProduct: (id) => ProductModel.findById(id),
      modifyProduct: (id, updates) => ProductModel.findByIdAndUpdate(id, updates, { new: true }),
    });
  });

  afterAll(async () => {
    console.log('Disconnecting from the database...');
    await Database.disconnect();
  });

  beforeEach(async () => {
    console.log('Clearing sales and products collections...');
    await SalesModel.Sales.deleteMany({});
    await ProductModel.deleteMany({});
    const salesCount = await SalesModel.Sales.countDocuments();
    const productCount = await ProductModel.countDocuments();
    console.log(`Sales count after clearing: ${salesCount}`);
    console.log(`Product count after clearing: ${productCount}`);
    expect(salesCount).toBe(0);
    expect(productCount).toBe(0);
  });

  it('should create a sale and calculate the total price correctly', async () => {
    console.log('Creating a test product...');
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });
    console.log(`Product created with ID: ${product._id}`);
    const salesData = {
      products: [
        {
          productId: product._id,
          quantity: 3,
        },
      ],
    };
    console.log('Creating a sale...');
    const sale = await salesService.createSale(salesData);
    console.log('Sale created:', sale);
    expect(sale).toHaveProperty('_id');
    expect(sale).toHaveProperty('totalPrice', 300);
    expect(sale.products[0].product._id.toString()).toBe(product._id.toString());
    const updatedProduct = await ProductModel.findById(product._id);
    console.log('Updated product:', updatedProduct);
    expect(updatedProduct.quantity).toBe(7);
  });

  it('should throw an error if the product is not found', async () => {
    const salesData = {
      products: [
        {
          productId: new mongoose.Types.ObjectId(),
          quantity: 1,
        },
      ],
    };
    console.log('Attempting to create a sale with a non-existent product...');
    await expect(salesService.createSale(salesData)).rejects.toThrow(new RegExp(`Produto com ID .* não encontrado`));
  });

  it('should throw an error if the product quantity is insufficient', async () => {
    console.log('Creating a product with limited quantity...');
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 2,
    });
    const salesData = {
      products: [
        {
          productId: product._id,
          quantity: 3,
        },
      ],
    };
    console.log('Attempting to create a sale with insufficient product quantity...');
    await expect(salesService.createSale(salesData)).rejects.toThrow(
      'Quantidade insuficiente em estoque para o produto: Test Product',
    );
  });

  it('should return a sale by ID', async () => {
    console.log('Creating a product and a sale...');
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });

    const sale = await SalesModel.create({
      products: [
        {
          product: product._id,
          quantity: 2,
          price: 100,
        },
      ],
      totalPrice: 200,
    });
    console.log(`Retrieving sale with ID: ${sale._id}`);

    const foundSale = await salesService.getSale(sale._id);
    console.log('Found sale:', foundSale);
    expect(foundSale).toBeTruthy();
    expect(foundSale.products[0].product._id.toString()).toBe(product._id.toString());
  });

  it('should return all sales', async () => {
    console.log('Creating multiple products and sales...');
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
      products: [
        {
          product: product1._id,
          quantity: 2,
          price: 100,
        },
      ],
      totalPrice: 200,
    });

    await SalesModel.create({
      products: [
        {
          product: product2._id,
          quantity: 3,
          price: 150,
        },
      ],
      totalPrice: 450,
    });
    console.log('Retrieving all sales...');
    const sales = await salesService.getAllSales();
    console.log('All sales retrieved:', sales);
    expect(sales).toHaveLength(2);
  });
});
