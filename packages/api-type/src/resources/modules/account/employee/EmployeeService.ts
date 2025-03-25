import { Services } from "#services";
import errors from "#errors";
import type { ModelEmployee, ServiceEmployee } from "#contract-account";
import type { SEmployee } from "#schema";
import type { SignInEmployeePayload, SignInBody as SignInParams } from "#http";
import type { ToObjectDocument } from "#mongoose-wrapper";
export default class EmployeeService
  extends Services
  implements ServiceEmployee
{
  constructor(protected model: ModelEmployee) {
    super();
  }
  public async signIn(credentials: SignInParams): Promise<string> {
    const user = await this.model.signIn(credentials.email);
    const isPasswordValid = await super.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw errors.Unauthorized([], "Invalid password");
    }

    const payload: SignInEmployeePayload = {
      sub: user._id.toString(),
      owner_id: user.owner_id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = super.signJWT(payload);
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

  public isAuth(token: string): SignInEmployeePayload {
    const decoded = super.verifyJWT<SignInEmployeePayload>(token);
    return decoded;
  }

  public async can(permission: string, userId: string): Promise<boolean> {
    return await super.can(permission, userId);
  }
}
