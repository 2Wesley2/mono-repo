import Authorization from './interface/index.js';
import { userService, roleService } from '../../../resources/modules/index.js';

const authorizationServiceArgs = {
  userService: userService,
  roleService: roleService,
};
const authorization = new Authorization({ ...authorizationServiceArgs });

export { authorization };
