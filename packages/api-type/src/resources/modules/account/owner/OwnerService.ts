import { UserServices } from "../../../../service/user";
import type {
  COwner,
  SOwner,
  signInParams,
  signInOwnerPayload,
} from "../contract/index";

export default class OwnerService extends UserServices {
  constructor(protected model: COwner) {
    super();
  }

  async signIn(credentials: signInParams) {
    const user = await this.model.signIn(credentials);
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
    const user = await this.model.signUp({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }
}
