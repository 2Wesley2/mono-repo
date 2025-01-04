import { Authorizer } from '../contracts/index.js';
import { isString } from '../../../../helpers/stringHelper.js';

export default class Authorization extends Authorizer {
  constructor(roleService) {
    super();
    this.roleService = roleService;
  }

  async authorize(role, permission) {
    const strings = [role, permission];
    isString(strings);
    try {
      const permissions = await this.#getPermissionsRole(role);
      const hasPermission = this.#hasPermission(permission, permissions);
      return hasPermission;
    } catch (error) {
      console.error(`[Authorization] Erro durante o fluxo de autorização: ${error.message}`);
      throw error;
    }
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
