import type { RoleModel } from "#contract-auth";
import type { SRole } from "#schema";

export default class RoleRepository {
  constructor(protected model: RoleModel) {}

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
