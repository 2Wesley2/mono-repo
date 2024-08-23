import SalesRepository from '../SalesRepository.js';
import SalesModel from '../SalesModel.js';

jest.mock('../SalesModel.js'); // Mock do SalesModel

describe('SalesRepository', () => {
  let salesRepository;

  beforeEach(() => {
    salesRepository = new SalesRepository(SalesModel);
  });

  it('should create a sale', async () => {
    const salesData = {
      products: [
        {
          product: 'product_id',
          quantity: 2,
          price: 100,
        },
      ],
      totalPrice: 200,
    };
    const savedSale = { ...salesData, _id: 'sale_id' };
    SalesModel.create.mockResolvedValue(savedSale);
    SalesModel.findById.mockResolvedValue(savedSale);
    const result = await salesRepository.createSale(salesData);

    expect(result).toEqual(savedSale);
    expect(SalesModel.create).toHaveBeenCalledWith(salesData);
  });

  it('should find a sale by ID', async () => {
    const sale = {
      _id: 'sale_id',
      productId: 'product_id',
      quantity: 2,
      totalPrice: 200,
    };

    SalesModel.findById.mockResolvedValue(sale);

    const result = await salesRepository.findSaleById('sale_id');

    expect(result).toEqual(sale);
    expect(SalesModel.findById).toHaveBeenCalledWith('sale_id');
  });

  it('should find all sales', async () => {
    const sales = [
      { _id: 'sale_id1', productId: 'product_id1', quantity: 2, totalPrice: 200 },
      { _id: 'sale_id2', productId: 'product_id2', quantity: 3, totalPrice: 300 },
    ];

    SalesModel.find.mockResolvedValue(sales);

    const result = await salesRepository.findAllSales();

    expect(result).toEqual(sales);
    expect(SalesModel.find).toHaveBeenCalled();
  });
});
