import type { SUser, SOwner } from "#schema";
import type { Types } from "mongoose";
export interface SignInPayload {
  id: Types.ObjectId;
  email: SUser["email"];
  firstName: SUser["firstName"];
  lastName: SUser["lastName"];
}

export interface SignInOwnerPayload extends SignInPayload {
  cnpj: SOwner["cnpj"];
  legalName: SOwner["legalName"];
  tradeName: SOwner["tradeName"];
}
