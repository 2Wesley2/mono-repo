import { SchemaDefinition } from "mongoose";
import UserModel from "../user/UserModel";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SOwner } from "#schema";
import type { ModelOwner } from "../contract/index";
import type { SignInBody as SignInParams } from "#http";
import type { NewDocumentPromise, SignInPromise } from "#type-mongoose-wrapper";

const ownerUserSchema: SchemaDefinition<SOwner> = {
  cnpj: { type: String, required: true, unique: true },
  legalName: { type: String, required: true, unique: true },
  tradeName: { type: String, default: "" },
};

export default class OwnerModel
  extends UserModel<SOwner>
  implements ModelOwner
{
  constructor(
    schema: RegisterDocumentParams<SOwner>["schemaDefinition"] = {},
    modelName: RegisterDocumentParams<SOwner>["collection"] = "Owner",
    options: RegisterDocumentParams<SOwner>["options"] = {},
    middlewares: RegisterDocumentParams<SOwner>["middlewares"] = [],
  ) {
    const combinedSchema = { ...ownerUserSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async signIn(email: SignInParams["email"]): SignInPromise<SOwner> {
    return await super.signIn(email);
  }

  public async signUp(data: SOwner): NewDocumentPromise<SOwner> {
    return await super.signUp(data);
  }
}
