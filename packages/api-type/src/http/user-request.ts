import type { Request } from "express";
import type { SUser } from "#schema";

export interface SignInBody {
  email: SUser["email"];
  password: SUser["password"];
}

export type SignInRequest = Request<unknown, any, SignInBody>;

export type SignUpRequest<T extends any = any> = Request<unknown, any, T>;
