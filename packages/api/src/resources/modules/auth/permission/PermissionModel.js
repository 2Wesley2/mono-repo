import Model from '../../../../core/entities/system/base/Model.js';
import { PERMISSION } from '../../../collections/index.js';

const permissionSchema = { name: { type: String, required: true } };

export default class PermissionModel extends Model {
  constructor() {
    super(permissionSchema, PERMISSION);
  }

  async createPermission(permissionData) {
    return await this.model.create(permissionData);
  }
}
