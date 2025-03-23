import type { SignInBody as SignInParams } from "#http";
import type { IUserModel, SignIn } from "src/contract/account";
import type { SEmployee } from "#schema";

export interface ModelEmployee extends IUserModel<SEmployee> {}
export interface ServiceEmployee extends Omit<ModelEmployee, "signIn"> {
  signIn: (credentials: SignInParams) => Promise<string>;
}
