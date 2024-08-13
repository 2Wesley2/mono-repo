import ProductService from '../ProductService.js';
import ProductRepository from '../ProductRepository.js';

jest.mock('../ProductRepository.js');

describe('ProductService', () => {
  let productService;
  let productRepository;

  beforeAll(() => {
    productRepository = new ProductRepository();
    productService = new ProductService(productRepository);
  });

  it('should add a new product', async () => {
    const productData = { name: 'Product 1', price: 100, quantity: 10 };
    productRepository.createProduct = jest.fn().mockResolvedValue(productData);

    const result = await productService.addProduct(productData);

    expect(productRepository.createProduct).toHaveBeenCalledWith(productData);
    expect(result).toEqual(productData);
  });

  it('should get a product by id', async () => {
    const product = { _id: '1', name: 'Product 1', price: 100, quantity: 10 };
    productRepository.findProductById = jest.fn().mockResolvedValue(product);

    const result = await productService.getProduct('1');

    expect(productRepository.findProductById).toHaveBeenCalledWith('1');
    expect(result).toEqual(product);
  });

  it('should modify a product', async () => {
    const productData = { name: 'Updated Product', price: 150, quantity: 5 };
    productRepository.updateProduct = jest.fn().mockResolvedValue(productData);

    const result = await productService.modifyProduct('1', productData);

    expect(productRepository.updateProduct).toHaveBeenCalledWith('1', productData);
    expect(result).toEqual(productData);
  });

  it('should remove a product', async () => {
    productRepository.deleteProduct = jest.fn().mockResolvedValue(true);

    const result = await productService.removeProduct('1');

    expect(productRepository.deleteProduct).toHaveBeenCalledWith('1');
    expect(result).toBe(true);
  });
});
