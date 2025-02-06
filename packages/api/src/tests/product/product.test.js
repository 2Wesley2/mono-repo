import ProductModel from '#src/resources/modules/logistics/product/ProductModel.js';
import ProductRepository from '#src/resources/modules/logistics/product/ProductRepository.js';
import ProductService from '#src/resources/modules/logistics/product/ProductService.js';
import ProductController from '#src/resources/modules/logistics/product/ProductController.js';
import loaders from '#src/core/loaders/index.js';

jest.setTimeout(30000);

let productController;
const ownerId = '67a3c5cbe96f2b4665c5e79c';

describe('Testes de criação de Produtos', () => {
  beforeAll(async () => {
    // Inicializa a conexão com o banco (ex.: MongoDB)
    await loaders.mongoose.init();

    const productModel = new ProductModel();
    const productRepository = new ProductRepository(productModel);
    const productService = new ProductService(productRepository);
    productController = new ProductController(productService);
  });

  afterEach(async () => {
    // Limpa a coleção de produtos após cada teste para evitar interferências.
    await productController.service.repository.model.model.deleteMany({});
  });

  afterAll(async () => {
    await loaders.mongoose.disconnect();
  });

  // Função auxiliar para simular os objetos req, res e next do Express.
  const criarRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
  };

  test('Deve criar um produto "ready_to_sell" com sucesso', async () => {
    const req = {
      body: {
        ownerId,
        barcode: '1234567890123',
        sku: 'SKU123',
        name: 'Produto Teste',
        price: 50.0,
        costPrice: 30.0,
        type: 'ready_to_sell',
        quantityInStock: 100,
        category: 'REFEIÇÕES',
      },
    };
    const res = criarRes();
    const next = jest.fn();

    await productController.createProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);

    // Capturamos a resposta enviada via res.json
    const responseData = res.json.mock.calls[0][0];

    // Verificamos a propriedade ownerId convertendo para string
    expect(responseData.data.ownerId).toEqual(ownerId);

    // Verificamos as demais propriedades usando toMatchObject
    expect(responseData).toMatchObject({
      success: true,
      data: {
        barcode: '1234567890123',
        sku: 'SKU123',
        name: 'Produto Teste',
        price: 50.0,
        costPrice: 30.0,
        type: 'ready_to_sell',
        quantityInStock: 100,
        category: 'REFEIÇÕES',
        __v: expect.any(Number),
        _id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Não deve criar um produto "ready_to_sell" sem o campo "quantityInStock"', async () => {
    const req = {
      body: {
        ownerId,
        barcode: '9876543210987',
        sku: 'SKU456',
        name: 'Produto Sem Estoque',
        price: 60.0,
        costPrice: 40.0,
        type: 'ready_to_sell',
        // quantityInStock ausente
        category: 'GERAL',
      },
    };
    const res = criarRes();
    const next = jest.fn();

    await productController.createProduct(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('Não deve criar um produto "ready_to_sell" com "quantityInStock" negativo', async () => {
    const req = {
      body: {
        ownerId,
        barcode: '5555555555555',
        sku: 'SKU789',
        name: 'Produto com Estoque Negativo',
        price: 70.0,
        costPrice: 50.0,
        type: 'ready_to_sell',
        quantityInStock: -5,
        category: 'BEBIDAS',
      },
    };
    const res = criarRes();
    const next = jest.fn();

    await productController.createProduct(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('Deve criar um produto "made_in_house" sem "quantityInStock" com sucesso', async () => {
    const req = {
      body: {
        ownerId,
        barcode: '2222222222222',
        sku: 'SKU222',
        name: 'Produto Feito em Casa',
        price: 80.0,
        costPrice: 60.0,
        type: 'made_in_house',
        // quantityInStock não é obrigatório para made_in_house
        category: 'LANCHES',
      },
    };
    const res = criarRes();
    const next = jest.fn();

    await productController.createProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);

    const responseData = res.json.mock.calls[0][0];

    // Verifica ownerId convertendo para string
    expect(responseData.data.ownerId).toEqual(ownerId);

    // Verifica as demais propriedades
    expect(responseData).toMatchObject({
      success: true,
      data: {
        barcode: '2222222222222',
        sku: 'SKU222',
        name: 'Produto Feito em Casa',
        price: 80.0,
        costPrice: 60.0,
        type: 'made_in_house',
        category: 'LANCHES',
        __v: expect.any(Number),
        _id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
