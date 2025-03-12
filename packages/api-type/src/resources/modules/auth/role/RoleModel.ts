import { SchemaDefinition } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "mongoose-wrapper";
import type { SRole } from "../contract/index";

const roleSchema: SchemaDefinition<SRole> = {
  owner_id: { type: String, ref: "Owner", required: true, unique: true },
  name: { type: String, required: true },
  permissions: [{ type: Array, ref: "Permission", required: true }],
};

export default class Role<T extends SRole> extends Model<T> {
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"] = {} as SchemaDefinition<T>,
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

  public async setRoleOwner(ownerId: SRole["owner_id"]) {
    const existsRoleForOwner = await this.model.findOne({ ownerId });
    if (existsRoleForOwner) {
      throw new Error(`Role owner already exists`);
    }
    const setNewRoleOwner: SRole = {
      owner_id: ownerId,
      name: "OWNER",
      permissions: [
        { name: "CREATE_EMPLOYEE", description: "Permite criar empregado" },
        { name: "DELETE_EMPLOYEE", description: "Permite deletar empregado" },
        { name: "UPDATE_EMPLOYEE", description: "Permite atualizar empregado" },
        { name: "EDIT_EMPLOYEE", description: "Permite editar empregado" },
        { name: "VIEW_EMPLOYEE", description: "Permite visualizar empregado" },
        { name: "CREATE_ROLE", description: "Permite criar role" },
        { name: "DELETE_ROLE", description: "Permite deletar role" },
        { name: "UPDATE_ROLE", description: "Permite atualizar role" },
        { name: "EDIT_ROLE", description: "Permite editar role" },
        { name: "VIEW_ROLE", description: "Permite visualizar role" },
      ],
    };
    return this.model.create(setNewRoleOwner);
  }

  public async setNewRole(role: SRole) {
    if (
      role.name.toUpperCase() === "ADMIN" ||
      role.name.toUpperCase() === "OWNER"
    ) {
      throw new Error(`Role name cannot be ${role.name}`);
    } else if (role.name.length < 3) {
      throw new Error(`Role name must be at least 3 characters`);
    }
    return this.model.create(role);
  }
}
