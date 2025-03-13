export interface SPerson {
  cpf: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  street: string;
  neighborhood: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state: string;
}

export interface SUser extends SPerson {
  email: string;
  password: string;
}

export interface SOwner extends SUser {
  cnpj: string;
  legalName: string;
  tradeName: string;
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

export interface MOwner {
  signIn: (credentials: signInParams) => Promise<any>;
  signUp: (data: SOwner) => Promise<any>;
}

export interface ROwner extends MOwner {}
export interface COwner extends MOwner {
  createEmployee: (employee: SEmployee) => Promise<any>;
}

export interface SEmployee extends SUser {
  owner_id: string;
}

export interface CEmployee {
  signIn: (credentials: signInParams) => Promise<any>;
  signUp: (data: SEmployee) => Promise<any>;
}
