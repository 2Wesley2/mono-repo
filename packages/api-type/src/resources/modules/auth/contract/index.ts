export interface SRole {
  owner_id: string;
  name: string;
  permissions: SPermission[];
}

export interface SPermission {
  _id?: string;
  name: string;
  description: string;
}

export interface CPermission {
  getPermissionByName: (name: SPermission["name"]) => Promise<any>;
  setNewPermission: (permission: SPermission) => Promise<any>;
  setManyPermissions: (permissions: SPermission[]) => Promise<any>;
}

export interface CRole {
  getRoleByOwnerId: (owner_id: SRole["owner_id"]) => Promise<any>;
  setRoleOwner: (ownerId: SRole["owner_id"]) => Promise<any>;
  setNewRole: (role: SRole) => Promise<any>;
}
