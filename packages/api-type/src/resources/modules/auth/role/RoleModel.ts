import { SchemaDefinition } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "mongoose-wrapper";
import type { SRole } from "../contract/index";

const roleSchema: SchemaDefinition<SRole> = {
  owner_id: { type: String, ref: "Owner", required: true, unique: true },
  name: { type: String, required: true },
  permissions: { type: Array, ref: "Permission", required: true },
};

export default class Role<T extends SRole> extends Model<T> {
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"],
    modelName: RegisterDocumentParams<T>["collection"] = "Role",
    options: RegisterDocumentParams<T>["options"] = {},
    middlewares: RegisterDocumentParams<T>["middlewares"] = [],
  ) {
    const combinedSchema = { ...roleSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async getRoleByOwnerId(owner_id: SRole["owner_id"]) {
    return this.model.findOne({ owner_id });
  }

  public async setNewRole(role: SRole) {
    if (
      role.name.toLowerCase() === "admin" ||
      role.name.toLowerCase() === "owner"
    ) {
      throw new Error(`Role name cannot be ${role.name}`);
    } else if (role.name.length < 3) {
      throw new Error(`Role name must be at least 3 characters`);
    }
    return this.model.create(role);
  }
}
