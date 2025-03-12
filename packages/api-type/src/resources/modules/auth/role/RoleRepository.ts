import type { CRole, SRole } from "../contract/index";

export default class RoleRepository {
  constructor(protected model: CRole) {}

  public async getRoleByOwnerId(owner_id: SRole["owner_id"]) {
    return this.model.getRoleByOwnerId(owner_id);
  }

  public async setRoleOwner(ownerId: SRole["owner_id"]) {
    return this.model.setRoleOwner(ownerId);
  }

  public async setNewRole(role: SRole) {
    return this.model.setNewRole(role);
  }
}
