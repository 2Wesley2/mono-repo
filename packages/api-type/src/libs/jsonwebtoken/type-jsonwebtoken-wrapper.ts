import { SignOptions, VerifyOptions, DecodeOptions } from "jsonwebtoken";

export interface JWTSign {
  (payload: object, options?: SignOptions): string;
}

export interface JWTVerify {
  (token: string, options?: VerifyOptions): object | string;
}

export interface JWTDecode {
  (token: string, options?: DecodeOptions): object | string | null;
}
