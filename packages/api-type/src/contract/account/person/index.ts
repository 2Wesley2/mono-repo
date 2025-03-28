import type { ToObjectDocument } from "#mongoose-wrapper/common/mongoose-types";

export type SignUp<T> = (data: T) => Promise<ToObjectDocument<T>>;

export interface IPersonModel<T> {
  signUp: SignUp<T>;
}
