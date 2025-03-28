import type { SchemaDefinition } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "#mongoose-wrapper/common/mongoose-types";
import type { SPermission } from "#schema";

const permissionSchema: SchemaDefinition<SPermission> = {
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
};

export default class Permission<T extends SPermission> extends Model<T> {
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"] = {} as SchemaDefinition<T>,
    modelName: RegisterDocumentParams<T>["collection"] = "Permission",
    options: RegisterDocumentParams<T>["options"] = {},
    middlewares: RegisterDocumentParams<T>["middlewares"] = [],
  ) {
    const combinedSchema = { ...permissionSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async getPermissionByName(name: SPermission["name"]) {
    return this.model.findOne({
      name,
    });
  }

  public async setNewPermission(permission: SPermission) {
    return this.model.create(permission);
  }

  public async setManyPermissions(permissions: SPermission[]) {
    return this.model.insertMany(permissions);
  }
}
