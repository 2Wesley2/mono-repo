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
    await Database.connect('test');
    salesRepository = new SalesRepository(SalesModel);
    salesService = new SalesService(salesRepository, {
      getProduct: (id) => ProductModel.findById(id),
      modifyProduct: (id, updates) => ProductModel.findByIdAndUpdate(id, updates, { new: true }),
    });
  });

  afterAll(async () => {
    await Database.disconnect();
  });

  afterEach(async () => {
    await SalesModel.Sales.deleteMany({});
    await ProductModel.deleteMany({});
  });

  it('should create a sale and calculate the total price correctly', async () => {
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });

    const salesData = {
      productId: product._id,
      quantity: 3,
    };

    const sale = await salesService.createSale(salesData);

    expect(sale).toHaveProperty('_id');
    expect(sale.totalPrice).toBe(300);
    expect(sale.productId.toString()).toBe(product._id.toString());

    const updatedProduct = await ProductModel.findById(product._id);
    expect(updatedProduct.quantity).toBe(7); // Original quantity 10 - 3 sold
  });

  it('should throw an error if the product is not found', async () => {
    const salesData = {
      productId: new mongoose.Types.ObjectId(),
      quantity: 1,
    };

    await expect(salesService.createSale(salesData)).rejects.toThrow('Produto não encontrado');
  });

  it('should throw an error if the product quantity is insufficient', async () => {
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 2,
    });

    const salesData = {
      productId: product._id,
      quantity: 3,
    };

    await expect(salesService.createSale(salesData)).rejects.toThrow('Quantidade em estoque insuficiente');
  });

  it('should return a sale by ID', async () => {
    const product = await ProductModel.create({
      name: 'Test Product',
      price: 100,
      quantity: 10,
    });

    const sale = await SalesModel.create({
      productId: product._id,
      quantity: 2,
      totalPrice: 200,
    });

    const foundSale = await salesService.getSale(sale._id);

    expect(foundSale).toBeTruthy();
    expect(foundSale.productId._id.toString()).toBe(product._id.toString());
  });

  it('should return all sales', async () => {
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

    const sales = await salesService.getAllSales();
    expect(sales).toHaveLength(2);
  });
});
