import bcrypt from "bcrypt";
import { BcryptHash, BcryptCompare } from "#bcrypt-type";
export default class BcryptWrapper {
  public str: string;
  constructor(public strArg: string) {
    this.str = strArg;
  }

  hash: BcryptHash = async (saltOrRounds) => {
    return await bcrypt.hash(this.str, saltOrRounds);
  };

  compare: BcryptCompare = async (encrypted) => {
    return await bcrypt.compare(this.str, encrypted);
  };
}
