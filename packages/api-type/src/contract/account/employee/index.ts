import type { SignInBody as SignInParams } from "#http";
import type { IUserModel } from "src/contract/account";
import type { SEmployee } from "#schema";
import type { SignInEmployeePayload } from "#http";

export interface ModelEmployee extends IUserModel<SEmployee> {}
export interface ServiceEmployee extends Omit<ModelEmployee, "signIn"> {
  signIn: (credentials: SignInParams) => Promise<string>;
  isAuth: (token: string) => SignInEmployeePayload;
  can: (permission: string, userId: string) => Promise<boolean>;
}
