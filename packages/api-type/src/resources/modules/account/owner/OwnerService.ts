import { Services } from "#services";
import type { RepositoryOwner, ServiceEmployee } from "../contract/index";
import type { SOwner, SEmployee } from "#schema";
import type { SignInOwnerPayload, SignInBody as SignInParams } from "#http";
import errors from "#errors";

export default class OwnerService extends Services {
  constructor(
    protected repository: RepositoryOwner,
    protected employeeService: ServiceEmployee,
  ) {
    super();
  }

  public async signIn(credentials: SignInParams) {
    const user = await this.repository.signIn(credentials.email);
    const isPasswordValid = await this.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw errors.Unauthorized([], "Invalid password");
    }

    const payload: SignInOwnerPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      cnpj: user.cnpj,
      legalName: user.legalName,
      tradeName: user.tradeName,
    };

    const token = this.signJWT(payload);
    return token;
  }

  public async signUp(userData: SOwner) {
    const hashedPassword = await this.hash(userData.password, 10);
    const user = await this.repository.signUp({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }

  async createEmployee(employee: SEmployee) {
    const user = await this.employeeService.signUp(employee);
    return user;
  }

  isAuth(token: string) {
    const decoded = this.verifyJWT(token);
    return decoded;
  }
}
