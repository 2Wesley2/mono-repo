import { Schema, SchemaDefinition } from "mongoose";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { NewDocumentPromise, SignInPromise } from "#type-mongoose-wrapper";
import type { SEmployee } from "#schema";
import type { ModelEmployee } from "../contract/index";
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
    modelName: RegisterDocumentParams<SEmployee>["collection"] = "Employee",
    options: RegisterDocumentParams<SEmployee>["options"] = {},
    middlewares: RegisterDocumentParams<SEmployee>["middlewares"] = [],
  ) {
    const combinedSchema = { ...employeeSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async signIn(email: SignInParams["email"]): SignInPromise<SEmployee> {
    return await super.signIn(email);
  }

  public async signUp(data: SEmployee): NewDocumentPromise<SEmployee> {
    return await super.signUp(data);
  }
}
