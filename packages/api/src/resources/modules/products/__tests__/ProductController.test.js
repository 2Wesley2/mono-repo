import ProductController from '../ProductController.js';
import ProductService from '../ProductService.js';
import { mockRequest, mockResponse } from 'jest-mock-req-res';

jest.mock('../ProductService.js');

describe('ProductController', () => {
  let productController;
  let productService;

  beforeAll(() => {
    productService = new ProductService();
    productController = new ProductController(productService);
  });

  it('should create a new product', async () => {
    const req = mockRequest({ body: { name: 'Product 1', price: 100, quantity: 10 } });
    const res = mockResponse();
    productService.addProduct = jest.fn().mockResolvedValue(req.body);

    await productController.createProduct(req, res);

    expect(productService.addProduct).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should get a product by id', async () => {
    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();
    const product = { _id: '1', name: 'Product 1', price: 100, quantity: 10 };
    productService.getProduct = jest.fn().mockResolvedValue(product);

    await productController.getProduct(req, res);

    expect(productService.getProduct).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(product);
  });

  it('should update a product', async () => {
    const req = mockRequest({ params: { id: '1' }, body: { name: 'Updated Product', price: 150, quantity: 5 } });
    const res = mockResponse();
    productService.modifyProduct = jest.fn().mockResolvedValue(req.body);

    await productController.updateProduct(req, res);

    expect(productService.modifyProduct).toHaveBeenCalledWith('1', req.body);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should delete a product', async () => {
    const req = mockRequest({ params: { id: '1' } });
    const res = mockResponse();
    productService.removeProduct = jest.fn().mockResolvedValue(true);

    await productController.deleteProduct(req, res);

    expect(productService.removeProduct).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Produto removido com sucesso' });
  });
});
