import services from "../libs/index";

export class UserServices {
  private s: typeof services;
  constructor() {
    this.s = services;
  }

  async hash(data: string, saltOrRounds: number) {
    return await this.s.bcrypt(data, "hash", saltOrRounds);
  }

  async compare(data: string, encrypted: string) {
    return await this.s.bcrypt(data, "compare", encrypted);
  }

  signJWT(payload: any, options?: any) {
    return this.s.jwt("sign", payload, options);
  }

  verifyJWT(token: string, options?: any) {
    return this.s.jwt("verify", token, options);
  }

  decodeJWT(token: string, options?: any) {
    return this.s.jwt("decode", token, options);
  }
}
