import { Schema } from "mongoose";
import type { SchemaDefinition } from "mongoose";
import type {
  RegisterDocumentParams,
  ToObjectDocument,
} from "#mongoose-wrapper";
import type { SEmployee } from "#schema";
import type { ModelEmployee } from "#contract-account";
import type { SignInBody as SignInParams } from "#http";
import UserModel from "../user/UserModel";

const employeeSchema: SchemaDefinition<SEmployee> = {
  owner_id: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
};

export default class EmployeeModel
  extends UserModel<SEmployee>
  implements ModelEmployee
{
  constructor(
    schema: RegisterDocumentParams<SEmployee>["schemaDefinition"] = {},
    collection: RegisterDocumentParams<SEmployee>["collection"] = "Employee",
    options: RegisterDocumentParams<SEmployee>["options"] = {},
    middlewares: RegisterDocumentParams<SEmployee>["middlewares"] = [],
  ) {
    const combinedSchema = { ...employeeSchema, ...schema };
    super(combinedSchema, collection, options, middlewares);
  }

  public async signIn(
    email: SignInParams["email"],
  ): Promise<ToObjectDocument<SEmployee>> {
    return await super.signIn(email);
  }

  public async signUp(data: SEmployee): Promise<ToObjectDocument<SEmployee>> {
    return await super.signUp(data);
  }
}
