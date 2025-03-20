import { SchemaDefinition } from "mongoose";
import { PersonModel } from "../person/PersonModel";
import errors from "#errors";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SignInPromise } from "#type-mongoose-wrapper";
import type { SUser } from "#schema";
import type { SignInBody as SignInParams } from "#http";

const userSchema: SchemaDefinition<SUser> = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel<T extends SUser> extends PersonModel<T> {
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"],
    modelName: RegisterDocumentParams<T>["collection"] = "User",
    options: RegisterDocumentParams<T>["options"] = {},
    middlewares: RegisterDocumentParams<T>["middlewares"] = [],
  ) {
    const combinedSchema = { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  protected async signIn(email: SignInParams["email"]): SignInPromise<T> {
    const user = await this.model.findOne({ email: email });
    if (!user) {
      throw errors.NotFound([{ field: "email", message: "User not found" }]);
    }
    return user.toObject();
  }
}
