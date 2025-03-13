import type { RegisterDocumentParams } from "mongoose-wrapper";
import UserModel from "../user/UserModel";
import type { MOwner, SOwner, signInParams } from "../contract/index";

const ownerUserSchema = {
  cnpj: { type: String, required: true, unique: true },
  legalName: { type: String, required: true, unique: true },
  tradeName: { type: String },
};

export default class OwnerModel extends UserModel implements MOwner {
  constructor(
    schema: RegisterDocumentParams<SOwner>["schemaDefinition"] = {},
    modelName: RegisterDocumentParams<SOwner>["collection"] = "Owner",
    options: RegisterDocumentParams<SOwner>["options"] = {},
    middlewares: RegisterDocumentParams<SOwner>["middlewares"] = [],
  ) {
    const combinedSchema = { ...ownerUserSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async signIn(credentials: signInParams): Promise<any> {
    const user = await this.model.findOne({ email: credentials.email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  public async signUp(data: SOwner): Promise<any> {
    return await this.model.create(data);
  }
}
