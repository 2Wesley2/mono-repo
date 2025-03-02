import { JWTSign, JWTVerify, JWTDecode } from "./type-jsonwebtoken-wrapper";
declare module "jsonwebtoken-wrapper" {
  export default class JSONWebToken {
    static sign: JWTSign;
    static verify: JWTVerify;
    static decode: JWTDecode;
  }
}
