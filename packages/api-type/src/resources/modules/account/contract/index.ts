import { SEmployee, SOwner } from "#schema";
import { SignInBody as SignInParams } from "#http";

export interface IModel<T> {
  signIn: (credentials: SignInParams) => Promise<any>;
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
