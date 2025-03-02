import { BcryptHash, BcryptCompare } from "./type-bcrypt-wrapper";
declare module "bcrypt-wrapper" {
  export default class BcryptWrapper {
    static hash: BcryptHash;
    static compare: BcryptCompare;
  }
}
