import type { RegisterDocumentParams } from "mongoose-wrapper";
import type { signInParams, SEmployee, ModelEmployee } from "../contract/index";
import UserModel from "../user/UserModel";
import errors from "#errors";

const employeeSchema = {
  owner_id: { type: String, ref: "Owner", required: true },
};

export default class EmployeeModel extends UserModel implements ModelEmployee {
  constructor(
    schema: RegisterDocumentParams<SEmployee>["schemaDefinition"] = {},
    modelName: RegisterDocumentParams<SEmployee>["collection"] = "Employee",
    options: RegisterDocumentParams<SEmployee>["options"] = {},
    middlewares: RegisterDocumentParams<SEmployee>["middlewares"] = [],
  ) {
    const combinedSchema = { ...employeeSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async signIn(credentials: signInParams): Promise<any> {
    const user = await this.model.findOne({ email: credentials.email });
    if (!user) {
      throw errors.NotFound([{ field: "email", message: "User not found" }]);
    }
    return user;
  }

  public async signUp(data: SEmployee): Promise<any> {
    return await this.model.create(data);
  }
}
