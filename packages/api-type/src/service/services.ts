import { BcryptWrapper } from "#bcrypt-wrapper";
import { JSONWebTokenWrapper } from "#jwt-wrapper";
import type { BcryptWrapper as TypeBcryptWrapper } from "#bcrypt-wrapper";
import type { JSONWebTokenWrapper as TypeJSONWebTokenWrapper } from "#jwt-wrapper";

export class Services {
  private bcryptWrapper: TypeBcryptWrapper;
  private jwtWrapper: TypeJSONWebTokenWrapper;

  constructor() {
    this.bcryptWrapper = new BcryptWrapper();
    this.jwtWrapper = new JSONWebTokenWrapper();
  }

  async hash(data: string, saltOrRounds: number) {
    return await this.bcryptWrapper.hash(data, saltOrRounds);
  }

  async compare(data: string, encrypted: string) {
    return await this.bcryptWrapper.compare(data, encrypted);
  }

  signJWT(payload: any, options?: any) {
    return this.jwtWrapper.sign(payload, options);
  }

  verifyJWT(token: string, options?: any) {
    return this.jwtWrapper.verify(token, options);
  }

  decodeJWT(token: string, options?: any) {
    return this.jwtWrapper.decode(token, options);
  }
}
