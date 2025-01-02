export default class RoleService {
  constructor(model) {
    this.model = model;
  }

  async getPermissionsByRole(roleName) {
    return await this.model.getPermissionsByRole(roleName);
  }
}
