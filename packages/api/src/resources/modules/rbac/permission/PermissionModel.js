import Model from '../../../components/Model.js';
import { PERMISSION } from '../../../constants/index.js';

const permissionSchema = { name: { type: String, required: true } };

export default class PermissionModel extends Model {
  constructor() {
    super(permissionSchema, PERMISSION);
  }

  async createPermission(permissionData) {
    return await this.model.create(permissionData);
  }
}
