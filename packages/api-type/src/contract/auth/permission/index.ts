import type { SPermission } from "#schema";

export interface PermissionModel {
  getPermissionByName: (name: SPermission["name"]) => Promise<any>;
  setNewPermission: (permission: SPermission) => Promise<any>;
  setManyPermissions: (permissions: SPermission[]) => Promise<any>;
}
