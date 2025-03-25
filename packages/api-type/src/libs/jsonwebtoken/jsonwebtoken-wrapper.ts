import jwt from "jsonwebtoken";
import type { Secret, JwtPayload } from "jsonwebtoken";
import config from "#config";
import type {
  JWTSign,
  JWTVerify,
  JWTDecode,
  IJSONWebTokenWrapper,
} from "#jwt-wrapper";

export class JSONWebTokenWrapper implements IJSONWebTokenWrapper {
  private secret: Secret = config.jwtSecret;
  constructor() {
    if (!this.secret || typeof this.secret !== "string") {
      throw new Error("JWT secret não definido na configuração.");
    }
  }

  sign: JWTSign = (payload, options): string => {
    return jwt.sign(payload, this.secret, options || {});
  };

  verify: JWTVerify = (token, options): JwtPayload => {
    const result = jwt.verify(token, this.secret, options || {});
    if (typeof result === "string") {
      throw new Error("Token inválido ou malformado");
    }
    return result;
  };

  decode: JWTDecode = (token, options): object | string | null => {
    return jwt.decode(token, options);
  };
}
