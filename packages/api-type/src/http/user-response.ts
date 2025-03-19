import { SUser, SOwner } from "#schema";

export interface SignInPayload {
  id: string;
  email: SUser["email"];
  name: SUser["firstName"];
  lastName: SUser["lastName"];
}

export interface SignInOwnerPayload extends SignInPayload {
  cnpj: SOwner["cnpj"];
  legalName: SOwner["legalName"];
  tradeName: SOwner["tradeName"];
}
