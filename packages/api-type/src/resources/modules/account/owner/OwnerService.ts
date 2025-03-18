import { UserServices } from "../../../../service/user";
import type {
  RepositoryOwner,
  SOwner,
  ServiceEmployee,
  SEmployee,
  signInParams,
  signInOwnerPayload,
} from "../contract/index";
import errors from "#errors";

export default class OwnerService extends UserServices {
  constructor(
    protected repository: RepositoryOwner,
    protected employeeService: ServiceEmployee,
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
      throw errors.Unauthorized([], "Invalid password");
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
    console.log(
      "Iniciando criação de funcionário no serviço. Dados recebidos:",
      employee,
    );
    console.log("Tipo dos dados recebidos:", typeof employee);
    const user = await this.employeeService.signUp(employee);
    console.log("Funcionário criado no serviço com sucesso. Resultado:", user);
    console.log("Tipo do resultado:", typeof user);
    return user;
  }

  isAuth(token: string) {
    const decoded = this.verifyJWT(token);
    return decoded;
  }
}
