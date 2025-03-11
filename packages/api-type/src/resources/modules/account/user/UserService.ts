import { UserServices } from "../../../../service/user";
import type { TUser, IUser, signInParams } from "./UserModel";

interface signInPayload {
  id: string;
  email: string;
  name: string;
  lastName: string;
}

export default class UserService extends UserServices {
  constructor(private model: TUser) {
    super();
    this.model = model;
  }

  async signIn(credentials: signInParams) {
    const user = await this.model.signIn(credentials);
    const isPasswordValid = await this.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const payload: signInPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    };

    const token = this.signJWT(payload);
    return token;
  }

  async signUp(userData: IUser) {
    const encryptedPassword = await this.hash(userData.password, 10);
    userData.password = encryptedPassword;
    return await this.model.signUp(userData);
  }
}
