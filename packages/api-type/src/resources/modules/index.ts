import OwnerModel from "./account/owner/OwnerModel";
import OwnerRepository from "./account/owner/OwnerRepository";
import OwnerService from "./account/owner/OwnerService";
import OwnerController from "./account/owner/OwnerController";
import Role from "./auth/role/RoleModel";
import RoleRepository from "./auth/role/RoleRepository";
import Permission from "./auth/permissions/PermissionModel";
import PermissionController from "./auth/permissions/PermissionController";
import EmployeeModel from "./account/employee/EmployeeModel";
import EmployeeService from "./account/employee/EmployeeService";
import EmployeeController from "./account/employee/EmployeeController";

const roleModel = new Role();
const roleRepository = new RoleRepository(roleModel);

const ownerModel = new OwnerModel();
const ownerRepository = new OwnerRepository(ownerModel, roleRepository);
const employeeModel = new EmployeeModel();
const employeeService = new EmployeeService(employeeModel);
const ownerService = new OwnerService(ownerRepository, employeeService);
const ownerController = new OwnerController(ownerService);
const employeeController = new EmployeeController(employeeService);
const permissionModel = new Permission();
const permissionController = new PermissionController(permissionModel);

export const controllers = {
  ownerUser: ownerController,
  employeeUser: employeeController,
  permission: permissionController,
} as const;
