import PermissionModel from '../../../resources/auth/rbac/permission/PermissionModel.js';
import RoleModel from '../../../resources/auth/rbac/role/RoleModel.js';
import RoleService from '../../../resources/auth/rbac/role/RoleService.js';
import Authorization from './interface/index.js';

const permissionModel = new PermissionModel();
const roleModel = new RoleModel();
const roleService = new RoleService(roleModel);

const authorization = new Authorization(roleService);

export { authorization };
