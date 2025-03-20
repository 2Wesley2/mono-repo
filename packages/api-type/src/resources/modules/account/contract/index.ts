import { SEmployee, SOwner } from "#schema";
import { SignInBody as SignInParams } from "#http";
import type { NewDocumentPromise } from "#type-mongoose-wrapper";

export interface IUserModel<T> {
  signIn: (email: SignInParams["email"]) => Promise<any>;
  signUp: (data: T) => NewDocumentPromise<T>;
}
export interface ModelOwner extends IUserModel<SOwner> {}
export interface RepositoryOwner extends ModelOwner {}

export interface ServiceOwner extends Omit<RepositoryOwner, "signIn"> {
  signIn: (email: SignInParams) => Promise<any>;
  createEmployee: (employee: SEmployee) => Promise<any>;
  isAuth: (token: string) => any;
}
export interface ModelEmployee extends IUserModel<SEmployee> {}
export interface ServiceEmployee extends Omit<ModelEmployee, "signIn"> {
  signIn: (email: SignInParams) => Promise<any>;
}
