import { Schema } from "mongoose";
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

export interface signInParams {
  email: SUser["email"];
  password: SUser["password"];
}

export interface signInPayload {
  id: string;
  email: SUser["email"];
  name: SUser["firstName"];
  lastName: SUser["lastName"];
}

export interface signInOwnerPayload extends signInPayload {
  cnpj: SOwner["cnpj"];
  legalName: SOwner["legalName"];
  tradeName: SOwner["tradeName"];
}

export interface SEmployee extends SUser {
  owner_id: Schema.Types.ObjectId;
}

export type EmployeeBodyRequest = Omit<SEmployee, "owner_id">;
export interface IModel<T> {
  signIn: (credentials: signInParams) => Promise<any>;
  signUp: (data: T) => Promise<any>;
}
export interface ModelOwner extends IModel<SOwner> {}
export interface RepositoryOwner extends ModelOwner {}
export interface ServiceOwner extends RepositoryOwner {
  createEmployee: (employee: SEmployee) => Promise<any>;
  isAuth: (token: string) => any;
}
export interface ModelEmployee extends IModel<SEmployee> {}
export interface ServiceEmployee extends ModelEmployee {}
