import { PersonModel } from "../person/PersonModel";
import BcryptWrapper from "../../../../libs/bcrypt/bcrypt-wrapper";
import type { IPerson } from "../person/PersonModel";
import type { RegisterDocumentParams } from "mongoose-wrapper";

export interface IUser extends IPerson {
  email: string;
  password: string;
}

export interface signInParams {
  email: IUser["email"];
  password: IUser["password"];
}

export interface TUser {
  signIn: (credentials: signInParams) => Promise<any>;
  signUp: (userData: IUser) => Promise<any>;
}
const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel extends PersonModel<IUser> {
  constructor(
    schema: RegisterDocumentParams<IUser>["schemaDefinition"] = {},
    modelName: RegisterDocumentParams<IUser>["collection"] = "User",
    options: RegisterDocumentParams<IUser>["options"] = {},
    middlewares: RegisterDocumentParams<IUser>["middlewares"] = [],
  ) {
    const combinedSchema = { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  public async signIn(credentials: signInParams): Promise<any> {
    const user = await this.model.findOne({ email: credentials.email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  public async signUp(userData: IUser): Promise<any> {
    return await super.signUp(userData);
  }
}
