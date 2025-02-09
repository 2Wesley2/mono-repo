import Model from '#core/infrastructure/components/base/Model.js';
import { ROLE } from '../../../../collections/index.js';

const roleSchema = {
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  ownerId: { type: Model.objectIdType, ref: OWNER, required: true },
  permissions: [{ type: String, required: true }]
};

export default class RoleModel extends Model {
  constructor() {
    super(roleSchema, ROLE);
  }

  async createRole(roleData, ownerId) {
    const dataToSave = { ...roleData, ownerId };
    const createdRole = await this.model.create(dataToSave);
    return createdRole;
  }

  async getRolesByOwner(ownerId) {
    return await this.model.find({ ownerId }).lean();
  }

  async updatePermissions(roleId, permissions) {
    return await this.model.findByIdAndUpdate(roleId, { permissions, updatedAt: new Date() }, { new: true });
  }
}
