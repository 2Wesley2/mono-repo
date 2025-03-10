import { BcryptHash, BcryptCompare } from "./type-bcrypt-wrapper";
declare module "bcrypt-wrapper" {
  export default class BcryptWrapper {
    hash: BcryptHash;
    compare: BcryptCompare;
  }
}
