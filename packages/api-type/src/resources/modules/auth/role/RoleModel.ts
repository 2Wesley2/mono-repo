import { SchemaDefinition } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "mongoose-wrapper";
import type { SRole, SPermission } from "../contract/index";

const roleSchema: SchemaDefinition<SRole> = {
  owner_id: { type: String, ref: "Owner", required: true, unique: true },
  name: { type: String, required: true },
  permissions: [
    {
      _id: false,
      name: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
};

const permissions = [
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
] as const;

const hashMapPermission = new Map<string, SPermission>(
  permissions.map((perm) => [perm.name.toUpperCase(), perm]),
);

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
    return this.model.findOne({ owner_id }).lean();
  }

  public async setRoleOwner(ownerId: SRole["owner_id"]) {
    const existsRoleForOwner = await this.model.findOne({ owner_id: ownerId });
    if (existsRoleForOwner) {
      throw new Error(`Role owner already exists`);
    }
    const setNewRoleOwner: SRole = {
      owner_id: ownerId,
      name: "OWNER",
      permissions: [...permissions],
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

  public async updatePermissions(
    userId: SRole["owner_id"],
    permissionsToRemove: SPermission["name"][],
    permissionsToAdd: SPermission["name"][],
  ) {
    const role = await this.model.findOne({ owner_id: userId });

    if (!role) {
      throw new Error(`Role não encontrada para owner_id: ${userId}`);
    }

    if (
      role.name.toUpperCase() === "ADMIN" ||
      role.name.toUpperCase() === "OWNER"
    ) {
      throw new Error(`Atualização não permitida para a role ${role.name}`);
    }

    const permissionsToPush = permissionsToAdd.map((name) => {
      const permission = hashMapPermission.get(name);

      if (!permission) {
        throw new Error(`Permissão para adicionar (${name}) não encontrada.`);
      }

      return permission;
    });

    return await this.model.findOneAndUpdate(
      { owner_id: userId },
      {
        $pull: { permissions: { name: { $in: permissionsToRemove } } },
        $push: { permissions: { $each: permissionsToPush } },
      },
      { new: true },
    );
  }
}
