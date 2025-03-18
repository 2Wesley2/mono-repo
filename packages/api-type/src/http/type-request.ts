import type { Request } from "express";
import type {
  signInParams as signInBody,
  SOwner as SOwnerBody,
} from "../resources/modules/account/contract/index";
import type { SProduct } from "../resources/modules/product/contract/index";

export type SignInRequest = Request<unknown, any, signInBody>;
export type SignUpRequest = Request<unknown, any, SOwnerBody>;

export type newProductBodyRequest = Request<
  unknown,
  any,
  Omit<SProduct, "owner_id">
>;
