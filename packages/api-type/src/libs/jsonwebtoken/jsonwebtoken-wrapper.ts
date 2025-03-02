import jwt from "jsonwebtoken";
import config from "../../config/index";
import { JWTSign, JWTVerify, JWTDecode } from "./type-jsonwebtoken-wrapper";

export default class JSONWebToken {
  static sign: JWTSign = (payload, options) => {
    if (!config.jwtSecret) {
      throw new Error("JWT secret não definido na configuração.");
    }
    return jwt.sign(payload, config.jwtSecret, options || {});
  };

  static verify: JWTVerify = (token, options) => {
    if (!config.jwtSecret) {
      throw new Error("JWT secret não definido na configuração.");
    }
    try {
      return jwt.verify(token, config.jwtSecret, options || {});
    } catch (error: any) {
      throw new Error(`Token inválido: ${error.message}`);
    }
  };

  static decode: JWTDecode = (token, options) => {
    return jwt.decode(token, options);
  };
}
