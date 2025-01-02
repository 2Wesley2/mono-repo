import Authorization from './interface/index.js';
import { userService, roleService } from '../../../../../resources/modules/index.js';

const authorizationServiceArgs = {
  userService: userService,
  roleService: roleService,
};
const authorizationService = new Authorization({ ...authorizationServiceArgs });

export { authorizationService };
