import { PersonModel } from "../person/PersonModel";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SUser } from "../contract/index";

const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel extends PersonModel<SUser> {
  constructor(
    schema: RegisterDocumentParams<SUser>["schemaDefinition"] = {},
    modelName: RegisterDocumentParams<SUser>["collection"] = "User",
    options: RegisterDocumentParams<SUser>["options"] = {},
    middlewares: RegisterDocumentParams<SUser>["middlewares"] = [],
  ) {
    const combinedSchema = { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }
}
