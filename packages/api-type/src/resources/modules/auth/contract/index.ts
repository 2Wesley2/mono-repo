export interface SRole {
  owner_id: string;
  name: string;
  permissions: SPermission;
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
