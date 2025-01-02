import { Authorizer } from '../contracts/index.js';
import { isString } from '../../../../../../helpers/stringHelper.js';

export default class Authorization extends Authorizer {
  constructor({ userService, roleService }) {
    super();
    this.userService = userService;
    this.roleService = roleService;
  }

  async authorize(userID, permission) {
    const strings = [userID, permission];
    isString(strings);
    try {
      const role = await this.#getRoleUser(userID);
      const permissions = await this.#getPermissionsRole(role);
      const hasPermission = this.#hasPermission(permission, permissions);
      return hasPermission;
    } catch (error) {
      console.error(`[Authorization] Erro durante o fluxo de autorização: ${error.message}`);
      throw error;
    }
  }

  async #getRoleUser(userID) {
    const role = await this.userService.getRoleByUser(userID);
    return role;
  }

  async #getPermissionsRole(role) {
    const permissions = await this.roleService.getPermissionsByRole(role);
    return permissions;
  }

  #hasPermission(permission, permissions) {
    const hasPermission = permissions.includes(permission);
    return hasPermission;
  }
}
