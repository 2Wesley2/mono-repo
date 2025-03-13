import { UserServices } from "../../../../service/user";
import type {
  ModelEmployee,
  SEmployee,
  signInParams,
  signInPayload,
} from "../contract/index";
import errors from "#errors";
export default class EmployeeService extends UserServices {
  constructor(protected model: ModelEmployee) {
    super();
  }

  async signIn(credentials: signInParams) {
    const user = await this.model.signIn(credentials);
    const isPasswordValid = await this.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw errors.Unauthorized([], "Invalid password");
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

  async signUp(userData: SEmployee) {
    const hashedPassword = await this.hash(userData.password, 10);
    const user = await this.model.signUp({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }
}
