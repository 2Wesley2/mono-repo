import type { RegisterDocumentParams } from "mongoose-wrapper";
import type { signInParams, SEmployee, CEmployee } from "../contract/index";
import UserModel from "../user/UserModel";

const employeeSchema = {
  owner_id: { type: String, ref: "Owner", required: true },
};

export default class EmployeeModel extends UserModel implements CEmployee {
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
      throw new Error("Employee not found");
    }
    return user;
  }

  public async signUp(data: SEmployee): Promise<any> {
    return await this.model.create(data);
  }
}
