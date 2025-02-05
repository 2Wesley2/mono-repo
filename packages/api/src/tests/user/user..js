import OwnerUserModel from '#src/resources/modules/account/user/owner/OwnerUserModel.js';
import OwnerUserRepository from '#src/resources/modules/account/user/owner/OwnerUserRepository.js';
import OwnerUserService from '#src/resources/modules/account/user/owner/OwnerUserService.js';
import OwnerUserController from '#src/resources/modules/account/user/employee/EmployeeUserController.js';

const ownerModel = new OwnerUserModel();
const ownerRepository = new OwnerUserRepository(ownerModel);
const ownerService = new OwnerUserService(ownerRepository);
const ownerController = new OwnerUserController(ownerService);

describe('', () => {
  test('', ()async => {
   const signUp = await ownerController.signUp();
    expect(mensagem).toBe('Hello World');
  });
});
