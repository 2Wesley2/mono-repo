import Model from '../../../components/Model.js';
import { ROLE, PERMISSION } from '../../../constants/index.js';
import loaders from '../../../../loaders/index.js';

const roleSchema = {
  name: { type: String, required: true },
  permissions: [{ type: loaders.mongoose.getObjectId(), ref: PERMISSION }],
};

export default class RoleModel extends Model {
  constructor() {
    super(roleSchema, ROLE);
  }

  async getPermissionsByRole(roleID) {
    try {
      const role = await this.#getRoleByName(roleID);
      const populatedRole = await role.populate({
        path: 'permissions',
        select: 'name',
      });
      const permissionNames = populatedRole.permissions.map((permission) => permission.name);
      return permissionNames;
    } catch (error) {
      throw error;
    }
  }

  async #getRoleByName(roleID) {
    try {
      const role = await this.model.findById(roleID);
      return role;
    } catch (error) {
      console.error(`[RoleModel] Erro ao buscar role pelo ID ${roleID}: ${error.message}`);
      throw error;
    }
  }

  async createRole(roleData) {
    try {
      const role = await this.model.create(roleData);
      return role;
    } catch (error) {
      console.error(`[RoleModel] Erro ao criar role: ${error.message}`);
      throw error;
    }
  }
}
