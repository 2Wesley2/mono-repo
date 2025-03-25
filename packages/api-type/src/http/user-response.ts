import type { JwtPayload } from "jsonwebtoken";
import type { SUser, SOwner, SEmployee } from "#schema";
export interface SignInPayload extends JwtPayload {
  sub: string;
  email: SUser["email"];
  firstName: SUser["firstName"];
  lastName: SUser["lastName"];
}

export interface SignInEmployeePayload extends SignInPayload {
  owner_id: SEmployee["owner_id"];
}
export interface SignInOwnerPayload extends SignInPayload {
  cnpj: SOwner["cnpj"];
  legalName: SOwner["legalName"];
  tradeName: SOwner["tradeName"];
}
