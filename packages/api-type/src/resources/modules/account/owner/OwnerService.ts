import { Services } from "#services";
import type {
  RepositoryOwner,
  ServiceEmployee,
  ServiceOwner,
} from "#contract-account";
import type { SOwner, SEmployee } from "#schema";
import type { SignInOwnerPayload, SignInBody as SignInParams } from "#http";
import errors from "#http-errors";
import type { ToObjectDocument } from "#mongoose-wrapper";
export default class OwnerService extends Services implements ServiceOwner {
  constructor(
    protected repository: RepositoryOwner,
    protected employeeService: ServiceEmployee,
  ) {
    super();
  }

  public async signIn(credentials: SignInParams): Promise<string> {
    const user = await this.repository.signIn(credentials.email);
    const isPasswordValid = await super.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw errors.Unauthorized([], "Invalid password");
    }

    const payload: SignInOwnerPayload = {
      sub: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      cnpj: user.cnpj,
      legalName: user.legalName,
      tradeName: user.tradeName,
    };

    const token = super.signJWT(payload);
    return token;
  }

  public async signUp(userData: SOwner): Promise<ToObjectDocument<SOwner>> {
    const hashedPassword = await this.hash(userData.password, 10);
    const user = await this.repository.signUp({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }
  public async createEmployee(
    employee: SEmployee,
  ): Promise<ToObjectDocument<SEmployee>> {
    const user = await this.employeeService.signUp(employee);
    return user;
  }

  public isAuth(token: string): SignInOwnerPayload {
    const decoded = super.verifyJWT<SignInOwnerPayload>(token);
    return decoded;
  }

  public async can(permission: string, userId: string): Promise<boolean> {
    return await super.can(permission, userId);
  }
}
