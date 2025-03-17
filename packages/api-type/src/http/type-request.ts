import type { Request } from "express";
import type {
  signInParams as signInBody,
  SOwner as SOwnerBody,
} from "../resources/modules/account/contract/index";

export type SignInRequest = Request<unknown, any, signInBody>;
export type SignUpRequest = Request<unknown, any, SOwnerBody>;
