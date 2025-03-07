import { PersonModel } from "../person/PersonModel";
import BcryptWrapper from "../../../../libs/bcrypt/bcrypt-wrapper";
import type { IPerson } from "../person/PersonModel";
import type { RegisterDocumentParams } from "mongoose-wrapper";
export interface TUser {
  signUp: (userData: IUser) => Promise<any>;
}

export interface IUser extends IPerson {
  email: string;
  password: string;
}

const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
} as const;

export default class UserModel extends PersonModel implements TUser {
  constructor(
    schema?: RegisterDocumentParams["schema"],
    modelName?: RegisterDocumentParams["modelName"],
    options?: RegisterDocumentParams["options"],
    middlewares?: RegisterDocumentParams["middlewares"],
  ) {
    const combinedSchema = { ...userSchema, ...schema };
    super(combinedSchema, (modelName = "User"), options, middlewares);
  }

  async signUp(userData: IUser): Promise<any> {
    const encryptedPassword = await BcryptWrapper.hash(userData.password, 10);
    userData.password = encryptedPassword;
    return await super.signUp(userData);
  }
}
