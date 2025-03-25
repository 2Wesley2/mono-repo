import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import config from "#config";
import { JWTSign, JWTVerify, JWTDecode } from "#jwt-wrapper";

export class JSONWebTokenWrapper {
  private secret: Secret = config.jwtSecret;
  constructor() {
    if (!this.secret || typeof this.secret !== "string") {
      throw new Error("JWT secret não definido na configuração.");
    }
  }

  sign: JWTSign = (payload, options) => {
    return jwt.sign(payload, this.secret, options || {});
  };

  verify: JWTVerify = (token, options) => {
    const result = jwt.verify(token, this.secret, options || {});
    if (typeof result === "string") {
      throw new Error("Token inválido ou malformado");
    }
    return result;
  };

  decode: JWTDecode = (token, options) => {
    return jwt.decode(token, options);
  };
}
