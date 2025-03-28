import { SchemaDefinition } from "mongoose";
import UserModel from "../user/UserModel";
import type {
  RegisterDocumentParams,
  ToObjectDocument,
} from "#mongoose-wrapper/common/mongoose-types";
import type { SOwner } from "#schema";
import type { ModelOwner } from "#contract-account";
import type { SignInBody as SignInParams } from "#http";

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
    collection: RegisterDocumentParams<SOwner>["collection"] = "Owner",
    options: RegisterDocumentParams<SOwner>["options"] = {},
    middlewares: RegisterDocumentParams<SOwner>["middlewares"] = [],
  ) {
    const combinedSchema = { ...ownerUserSchema, ...schema };
    super(combinedSchema, collection, options, middlewares);
  }

  public async signIn(
    credential: SignInParams["email"],
  ): Promise<ToObjectDocument<SOwner>> {
    return await super.signIn(credential);
  }

  public async signUp(data: SOwner): Promise<ToObjectDocument<SOwner>> {
    return await super.signUp(data);
  }
}
