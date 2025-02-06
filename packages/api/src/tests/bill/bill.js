import BillModel from '#src/resources/modules/commercial/bill/BillModel.js';
import BillRepository from '#src/resources/modules/commercial/bill/BillRepository.js';
import BillService from '#src/resources/modules/commercial/bill/BillService.js';
import BillController from '#src/resources/modules/commercial/bill/BillController.js';
import loaders from '#src/core/loaders/index.js';

jest.setTimeout(30000);

let billController;

const ownerId = '67a3c5cbe96f2b4665c5e79c';
describe('Testes de BillController', () => {
  beforeAll(async () => {
    await loaders.mongoose.init();

    const billModel = new BillModel();
    const billRepository = new BillRepository(billModel);
    const billService = new BillService(billRepository);
    billController = new BillController(billService);
  });

  afterAll(async () => {
    // Se desejar limpar a base de dados para os testes, descomente a linha abaixo:
    // await loaders.mongoose.dropDatabase('system_test');
    await loaders.mongoose.disconnect();
  });
});
