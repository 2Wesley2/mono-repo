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

export interface COwner {
  signIn: (credentials: signInParams) => Promise<any>;
  signUp: (data: SOwner) => Promise<any>;
}
