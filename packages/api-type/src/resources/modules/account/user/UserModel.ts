import PersonModel from "../person/PersonModel.ts";
import { bcrypt } from "../../../../libs/bcrypt/index.ts";

const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel extends PersonModel {
  constructor(schema = {}, modelName: string, options = {}, middlewares = []) {
    const combinedSchema = { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }

  async signUp(userData: Record<string, any>) {
    const encryptedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = encryptedPassword;
    return await super.signUp(userData);
  }
}
