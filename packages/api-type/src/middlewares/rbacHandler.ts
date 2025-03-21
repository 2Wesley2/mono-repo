import { MongooseWrapper } from "../libs/mongoose/mongoose-wrapper";
import { SRole } from "../resources/modules/auth/contract/index";
import { toObjectId } from "#type-mongoose-wrapper";
export default class RbacHandler {
  static async can(permission: string, userId: string) {
    permission = permission.toUpperCase();
    const userIdObj = toObjectId(userId);
    const RoleModel = MongooseWrapper.getCollectionByName<SRole>("Role");
    const role = await RoleModel.findOne({ owner_id: userIdObj })
      .select("permissions")
      .lean();
    if (!role) return false;

    return role.permissions.some(
      (perm: { name: string }) => perm.name === permission,
    );
  }
}
