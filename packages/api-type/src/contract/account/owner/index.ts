import type { SignInBody as SignInParams } from "#http";
import type { IUserModel } from "#contract-account";
import type { SOwner, SEmployee } from "#schema";

export interface ModelOwner extends IUserModel<SOwner> {}
export interface RepositoryOwner extends ModelOwner {}
export interface ServiceOwner extends Omit<RepositoryOwner, "signIn"> {
  signIn: (data: SignInParams) => Promise<string>;
  createEmployee: (employee: SEmployee) => Promise<any>;
  isAuth: (token: string) => any;
}
