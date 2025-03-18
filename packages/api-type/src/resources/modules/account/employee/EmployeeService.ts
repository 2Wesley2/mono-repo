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
    console.log(
      "Iniciando cadastro de funcionário. Dados recebidos:",
      userData,
    );
    console.log("Tipo dos dados recebidos:", typeof userData);
    const hashedPassword = await this.hash(userData.password, 10);
    console.log(
      "Senha criptografada com sucesso. Tipo da senha:",
      typeof hashedPassword,
    );
    const user = await this.model.signUp({
      ...userData,
      password: hashedPassword,
    });
    console.log(
      "Funcionário cadastrado com sucesso no modelo. Resultado:",
      user,
    );
    console.log("Tipo do resultado:", typeof user);
    return user;
  }
}
