import jwt from "jsonwebtoken";
import config from "../../config/index";
import { JWTSign, JWTVerify, JWTDecode } from "./type-jsonwebtoken-wrapper";

export class JSONWebTokenWrapper {
  sign: JWTSign = (payload, options) => {
    if (!config.jwtSecret) {
      throw new Error("JWT secret não definido na configuração.");
    }
    return jwt.sign(payload, config.jwtSecret, options || {});
  };

  verify: JWTVerify = (token, options) => {
    if (!config.jwtSecret) {
      throw new Error("JWT secret não definido na configuração.");
    }
    try {
      return jwt.verify(token, config.jwtSecret, options || {});
    } catch (error: any) {
      throw new Error(`Token inválido: ${error.message}`);
    }
  };

  decode: JWTDecode = (token, options) => {
    return jwt.decode(token, options);
  };
}
