import { SchemaDefinition, Schema } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SRole, SPermission } from "../contract/index";
import errors from "#errors";

const roleSchema: SchemaDefinition<SRole> = {
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
    unique: true,
  },
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
      throw errors.Conflict(
        [{ field: "owner_id", value: ownerId }],
        "Role owner already exists",
      );
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
      throw errors.BadRequest(
        [{ field: "name" }],
        `Role name cannot be ${role.name}`,
      );
    } else if (role.name.length < 3) {
      throw errors.BadRequest(
        [{ field: "name", message: "Role name must be at least 3 characters" }],
        "Invalid role name",
      );
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
      throw errors.NotFound([{ field: "owner_id", value: userId }]);
    }

    if (
      role.name.toUpperCase() === "ADMIN" ||
      role.name.toUpperCase() === "OWNER"
    ) {
      throw errors.Forbidden(
        [{ field: "name" }],
        `Atualização não permitida para a role ${role.name}`,
      );
    }

    const permissionsToPush = permissionsToAdd.map((name) => {
      const permission = hashMapPermission.get(name);

      if (!permission) {
        throw errors.BadRequest(
          [{ field: "permissions", value: name }],
          `Permissão para (${name}) não encontrada.`,
        );
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
