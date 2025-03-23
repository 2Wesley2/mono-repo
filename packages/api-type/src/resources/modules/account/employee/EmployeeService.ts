import { Services } from "#services";
import errors from "#errors";
import type { ModelEmployee } from "#contract-account";
import type { SEmployee } from "#schema";
import type { SignInPayload, SignInBody as SignInParams } from "#http";
import type { ToObjectDocument } from "#mongoose-wrapper";
export default class EmployeeService extends Services {
  constructor(protected model: ModelEmployee) {
    super();
  }
  public async signIn(credentials: SignInParams): Promise<string> {
    const user = await this.model.signIn(credentials.email);
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
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = this.signJWT(payload);
    return token;
  }

  public async signUp(
    userData: SEmployee,
  ): Promise<ToObjectDocument<SEmployee>> {
    const hashedPassword = await this.hash(userData.password, 10);
    const user = await this.model.signUp({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }
}
