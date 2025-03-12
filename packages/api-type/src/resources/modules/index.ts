import OwnerModel from "./account/owner/OwnerModel";
import OwnerService from "./account/owner/OwnerService";
import OwnerController from "./account/owner/OwnerController";
import Permission from "./auth/permissions/PermissionModel";
import PermissionController from "./auth/permissions/PermissionController";
import { permission } from "process";

const ownerModel = new OwnerModel();
const ownerService = new OwnerService(ownerModel);
const ownerController = new OwnerController(ownerService);

const permissionModel = new Permission();
const permissionController = new PermissionController(permissionModel);

export const controllers = {
  ownerUser: ownerController,
  permission: permissionController,
} as const;
