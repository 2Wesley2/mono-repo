import { UserServices } from "../../../../service/user";
import type { TUser, IUser, signInParams } from "./UserModel";

export default class UserService extends UserServices {
  constructor(private userModel: TUser) {
    super();
    this.userModel = userModel;
  }
  async signIn(credentials: signInParams) {
    const user = await this.userModel.signIn(credentials);
    const isPasswordValid = await this.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = this.signJWT(payload);
    return token;
  }
  async signUp(userData: IUser) {
    const encryptedPassword = await this.hash(userData.password, 10);
    userData.password = encryptedPassword;
    return await this.userModel.signUp(userData);
  }
}
