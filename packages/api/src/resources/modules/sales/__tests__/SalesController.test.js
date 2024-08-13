import { mockRequest, mockResponse } from 'jest-mock-req-res';
import SalesController from '../SalesController.js';
import SalesService from '../SalesService.js';

jest.mock('../SalesService.js');

describe('SalesController', () => {
  let salesController;

  beforeEach(() => {
    jest.clearAllMocks();
    salesController = new SalesController(SalesService);
    SalesService.createSale = jest.fn();
    SalesService.getSale = jest.fn();
    SalesService.getAllSales = jest.fn();
  });

  it('should process the sale correctly', async () => {
    const req = mockRequest({
      body: {
        productId: 'product_id',
        quantity: 2,
      },
    });
    const res = mockResponse();

    SalesService.createSale.mockResolvedValue({ _id: 'sale_id', ...req.body, totalPrice: 200 });

    await salesController.createSale(req, res);
    expect(SalesService.createSale).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: 'sale_id', ...req.body, totalPrice: 200 });
  });

  it('should return an error if sale creation fails', async () => {
    const req = mockRequest({
      body: {
        productId: 'product_id',
        quantity: 2,
      },
    });
    const res = mockResponse();

    SalesService.createSale.mockRejectedValue(new Error('Sale creation failed'));

    await salesController.createSale(req, res);
    expect(SalesService.createSale).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Sale creation failed' });
  });

  it('should return a sale by ID', async () => {
    const req = mockRequest({
      params: { id: 'sale_id' },
    });
    const res = mockResponse();

    SalesService.getSale.mockResolvedValue({ _id: 'sale_id', productId: 'product_id', quantity: 2, totalPrice: 200 });

    await salesController.getSale(req, res);
    expect(SalesService.getSale).toHaveBeenCalledWith('sale_id');
    expect(res.json).toHaveBeenCalledWith({ _id: 'sale_id', productId: 'product_id', quantity: 2, totalPrice: 200 });
  });

  it('should return 404 if sale not found by ID', async () => {
    const req = mockRequest({
      params: { id: 'invalid_id' },
    });
    const res = mockResponse();

    SalesService.getSale.mockResolvedValue(null);

    await salesController.getSale(req, res);
    expect(SalesService.getSale).toHaveBeenCalledWith('invalid_id');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Venda não encontrada' });
  });

  it('should return all sales', async () => {
    const req = mockRequest();
    const res = mockResponse();

    const sales = [
      { _id: 'sale_id1', productId: 'product_id1', quantity: 2, totalPrice: 200 },
      { _id: 'sale_id2', productId: 'product_id2', quantity: 3, totalPrice: 300 },
    ];

    SalesService.getAllSales.mockResolvedValue(sales);

    await salesController.getAllSales(req, res);
    expect(SalesService.getAllSales).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(sales);
  });

  it('should return 500 if getAllSales fails', async () => {
    const req = mockRequest();
    const res = mockResponse();

    SalesService.getAllSales.mockRejectedValue(new Error('Failed to retrieve sales'));

    await salesController.getAllSales(req, res);
    expect(SalesService.getAllSales).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve sales' });
  });
});
