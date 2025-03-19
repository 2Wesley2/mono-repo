import { SchemaDefinition } from "mongoose";
import UserModel from "../user/UserModel";
import errors from "#errors";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SOwner } from "#schema";
import type { ModelOwner } from "../contract/index";
import type { SignInBody as SignInParams } from "#http";

const ownerUserSchema: SchemaDefinition<SOwner> = {
  cnpj: { type: String, required: true, unique: true },
  legalName: { type: String, required: true, unique: true },
  tradeName: { type: String, default: "" },
};

export default class OwnerModel extends UserModel implements ModelOwner {
  constructor(
    schema: RegisterDocumentParams<SOwner>["schemaDefinition"] = {},
    modelName: RegisterDocumentParams<SOwner>["collection"] = "Owner",
    options: RegisterDocumentParams<SOwner>["options"] = {},
    middlewares: RegisterDocumentParams<SOwner>["middlewares"] = [],
  ) {
    const combinedSchema = { ...ownerUserSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  protected async signIn(credentials: SignInParams): Promise<any> {
    const user = await this.model.findOne({ email: credentials.email }).lean();
    if (!user) {
      throw errors.NotFound([{ field: "email", message: "User not found" }]);
    }
    return user;
  }

  public async signUp(data: SOwner): Promise<any> {
    return await this.model.create(data);
  }
}
