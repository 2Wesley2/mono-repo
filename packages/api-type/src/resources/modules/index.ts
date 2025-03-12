import OwnerModel from "./account/owner/OwnerModel";
import OwnerRepository from "./account/owner/OwnerRepository";
import OwnerService from "./account/owner/OwnerService";
import OwnerController from "./account/owner/OwnerController";
import Role from "./auth/role/RoleModel";
import RoleRepository from "./auth/role/RoleRepository";
import Permission from "./auth/permissions/PermissionModel";
import PermissionController from "./auth/permissions/PermissionController";

const roleModel = new Role();
const roleRepository = new RoleRepository(roleModel);

const ownerModel = new OwnerModel();
const ownerRepository = new OwnerRepository(ownerModel, roleRepository);
const ownerService = new OwnerService(ownerRepository);
const ownerController = new OwnerController(ownerService);

const permissionModel = new Permission();
const permissionController = new PermissionController(permissionModel);

export const controllers = {
  ownerUser: ownerController,
  permission: permissionController,
} as const;
