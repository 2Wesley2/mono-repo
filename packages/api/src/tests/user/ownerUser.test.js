import loaders from '#src/core/loaders/index.js';
import OwnerUserModel from '#src/resources/modules/account/user/owner/OwnerUserModel.js';
import OwnerUserRepository from '#src/resources/modules/account/user/owner/OwnerUserRepository.js';
import OwnerUserService from '#src/resources/modules/account/user/owner/OwnerUserService.js';
import OwnerUserController from '#src/resources/modules/account/user/owner/OwnerUserController.js';

jest.setTimeout(30000);

let ownerController;

describe('Testes do OwnerUserController', () => {
  beforeAll(async () => {
    await loaders.mongoose.init();

    const ownerModel = new OwnerUserModel();
    const ownerRepository = new OwnerUserRepository(ownerModel);
    const ownerService = new OwnerUserService(ownerRepository);
    ownerController = new OwnerUserController(ownerService);
  });

  test('signUp: Deve retornar status 200 e o usuário criado', async () => {
    const req = {
      body: {
        cpf: '12345678900',
        firstName: 'Fulano',
        lastName: 'de Tal',
        birthDate: '1990-01-01',
        street: 'Rua ABC',
        neighborhood: 'Bairro XYZ',
        houseNumber: '123',
        postalCode: '12345-678',
        city: 'Cidade Exemplo',
        state: 'Estado Exemplo',
        email: 'fulano@example.com',
        password: 'senha123',
        cnpj: '98765432100',
        legalName: 'Empresa X',
        tradeName: 'Empresa X LTDA',
      },
    };

    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    const res = { status: statusMock };
    const next = jest.fn();

    await ownerController.signUp(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(200);

    const userCreated = jsonMock.mock.calls[0][0];
    expect(userCreated).toEqual({
      _id: expect.any(String),
      cpf: '12345678900',
      firstName: 'Fulano',
      lastName: 'de Tal',
      birthDate: expect.any(Date),
      street: 'Rua ABC',
      neighborhood: 'Bairro XYZ',
      houseNumber: '123',
      postalCode: '12345-678',
      city: 'Cidade Exemplo',
      state: 'Estado Exemplo',
      email: 'fulano@example.com',
      password: expect.any(String),
      cnpj: '98765432100',
      legalName: 'Empresa X',
      tradeName: 'Empresa X LTDA',
      role: 'owner',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      __v: 0,
    });
  });

  afterAll(async () => {
    {
      /*await loaders.mongoose.dropDatabase('system_test');*/
    }
    await loaders.mongoose.dropDatabase('system_test');
    await loaders.mongoose.disconnect();
  });
});
