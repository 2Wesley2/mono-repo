import { Services } from "#services";
import type { ModelEmployee } from "../contract/index";
import type { SEmployee } from "#schema";
import type { SignInPayload, SignInBody as SignInParams } from "#http";
import errors from "#errors";
export default class EmployeeService extends Services {
  constructor(protected model: ModelEmployee) {
    super();
  }

  public async signIn(credentials: SignInParams) {
    const user = await this.model.signIn(credentials);
    const isPasswordValid = await this.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw errors.Unauthorized([], "Invalid password");
    }

    const payload: SignInPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    };

    const token = this.signJWT(payload);
    return token;
  }

  public async signUp(userData: SEmployee) {
    const hashedPassword = await this.hash(userData.password, 10);
    const user = await this.model.signUp({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }
}
