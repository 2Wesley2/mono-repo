import ProductRepository from '../ProductRepository.js';
import ProductModel from '../ProductModel.js';

describe('ProductRepository', () => {
  let productRepository;

  beforeAll(() => {
    productRepository = new ProductRepository(ProductModel);
  });

  it('should create a product', async () => {
    const productData = { name: 'Product 1', price: 100, quantity: 10 };
    ProductModel.create = jest.fn().mockResolvedValue(productData);

    const result = await productRepository.createProduct(productData);

    expect(ProductModel.create).toHaveBeenCalledWith(productData);
    expect(result).toEqual(productData);
  });

  it('should find a product by id', async () => {
    const product = { _id: '1', name: 'Product 1', price: 100, quantity: 10 };
    ProductModel.findById = jest.fn().mockResolvedValue(product);

    const result = await productRepository.findProductById('1');

    expect(ProductModel.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(product);
  });

  it('should update a product', async () => {
    const productData = { name: 'Updated Product', price: 150, quantity: 5 };
    ProductModel.update = jest.fn().mockResolvedValue(productData);

    const result = await productRepository.updateProduct('1', productData);

    expect(ProductModel.update).toHaveBeenCalledWith('1', productData);
    expect(result).toEqual(productData);
  });

  it('should delete a product', async () => {
    const deleteMock = jest.fn().mockResolvedValue(true);
    ProductModel.delete = deleteMock;

    const result = await productRepository.deleteProduct('1');

    expect(deleteMock).toHaveBeenCalledWith('1');
    expect(result).toBe(true);
  });
});
