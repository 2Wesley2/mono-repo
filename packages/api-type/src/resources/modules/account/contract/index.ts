import { SEmployee, SOwner } from "#schema";
import { SignInBody as SignInParams } from "#http";

export interface IUserModel<T> {
  signIn: (credentials: SignInParams) => Promise<any>;
  signUp: (data: T) => Promise<any>;
}
export interface ModelOwner extends IUserModel<SOwner> {}

export interface RepositoryOwner extends ModelOwner {}
export interface ServiceOwner extends RepositoryOwner {
  createEmployee: (employee: SEmployee) => Promise<any>;
  isAuth: (token: string) => any;
}
export interface ModelEmployee extends IUserModel<SEmployee> {}
export interface ServiceEmployee extends ModelEmployee {}
