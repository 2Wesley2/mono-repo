import mongoose from 'mongoose';
import ProductModel from '../ProductModel.js';

describe('ProductModel', () => {
  beforeAll(() => {
    mongoose.connect = jest.fn();
  });

  it('should define a product schema', () => {
    expect(ProductModel.Product.schema.obj).toHaveProperty('name');
    expect(ProductModel.Product.schema.obj).toHaveProperty('price');
    expect(ProductModel.Product.schema.obj).toHaveProperty('quantity');
  });

  it('should create a new product', async () => {
    const saveMock = jest.fn().mockResolvedValue({ name: 'Product 1', price: 100, quantity: 10 });
    ProductModel.Product = jest.fn(() => ({ save: saveMock }));

    const productData = { name: 'Product 1', price: 100, quantity: 10 };
    const result = await ProductModel.create(productData);

    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual(productData);
  });
});
