import type { SchemaDefinition } from "mongoose";
import { PersonModel } from "../person/PersonModel";
import errors from "#http-errors";
import type {
  RegisterDocumentParams,
  ToObjectDocument,
} from "#mongoose-wrapper/common/mongoose-types";
import type { SUser } from "#schema";
import type { SignInBody as SignInParams } from "#http";
import type { IUserModel } from "#contract-account";

const userSchema: SchemaDefinition<SUser> = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel<T extends SUser>
  extends PersonModel<T>
  implements IUserModel<T>
{
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"],
    collection: RegisterDocumentParams<T>["collection"] = "User",
    options: RegisterDocumentParams<T>["options"] = {},
    middlewares: RegisterDocumentParams<T>["middlewares"] = [],
  ) {
    const combinedSchema = { ...userSchema, ...schema };
    super(combinedSchema, collection, options, middlewares);
  }

  public async signIn(
    credential: SignInParams["email"],
  ): Promise<ToObjectDocument<T>> {
    const user = await this.model.findOne({ email: credential });
    if (!user) {
      throw errors.NotFound([{ field: "email", message: "User not found" }]);
    }
    return user.toObject();
  }
}
