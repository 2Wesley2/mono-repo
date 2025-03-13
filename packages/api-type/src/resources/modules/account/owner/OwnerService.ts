import { UserServices } from "../../../../service/user";
import type {
  RepositoryOwner,
  SOwner,
  ModelEmployee,
  SEmployee,
  signInParams,
  signInOwnerPayload,
} from "../contract/index";

export default class OwnerService extends UserServices {
  constructor(
    protected repository: RepositoryOwner,
    protected employeeService: ModelEmployee,
  ) {
    super();
  }

  async signIn(credentials: signInParams) {
    const user = await this.repository.signIn(credentials);
    const isPasswordValid = await this.compare(
      credentials.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const payload: signInOwnerPayload = {
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

  async signUp(userData: SOwner) {
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
