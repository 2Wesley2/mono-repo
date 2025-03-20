import { Types } from "mongoose";

export interface SPerson {
  cpf: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  street?: string;
  neighborhood?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  state?: string;
}

export interface SUser extends SPerson {
  email: string;
  password: string;
}

export interface SOwner extends SUser {
  cnpj: string;
  legalName: string;
  tradeName?: string;
}

export interface SEmployee extends SUser {
  owner_id: Types.ObjectId;
}
