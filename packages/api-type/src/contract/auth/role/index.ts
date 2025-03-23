import type { SRole } from "#schema";

export interface RoleModel {
  getRoleByOwnerId: (owner_id: SRole["owner_id"]) => Promise<any>;
  setRoleOwner: (ownerId: SRole["owner_id"]) => Promise<any>;
  setNewRole: (role: SRole) => Promise<any>;
}
