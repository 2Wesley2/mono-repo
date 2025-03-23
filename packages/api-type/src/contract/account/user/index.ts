import type { SignInBody as SignInParams } from "#http";
import type { ToObjectDocument } from "#mongoose-wrapper";
import type { IPersonModel } from "#contract-account";

export type SignIn<T> = (
  credential: SignInParams["email"],
) => Promise<ToObjectDocument<T>>;

export interface IUserModel<T> extends IPersonModel<T> {
  signIn: SignIn<T>;
}
