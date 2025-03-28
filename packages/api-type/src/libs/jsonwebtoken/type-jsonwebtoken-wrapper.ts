import type {
  SignOptions,
  VerifyOptions,
  DecodeOptions,
  JwtPayload
} from "jsonwebtoken";

export interface JWTSign {
  (payload: JwtPayload, options?: SignOptions): string;
}

export interface JWTVerify<T extends JwtPayload = JwtPayload> {
  (token: string, options?: VerifyOptions): T;
}
export interface JWTDecode {
  (token: string, options?: DecodeOptions): object | string | null;
}

export interface IJSONWebTokenWrapper {
  sign: JWTSign;
  verify: JWTVerify;
  decode: JWTDecode;
}
