import bcrypt from "bcrypt";
import { BcryptHash, BcryptCompare } from "#bcrypt-type";

export default class BcryptWrapper {
  static hash: BcryptHash = async (data, saltOrRounds) => {
    return await bcrypt.hash(data, saltOrRounds);
  };

  static compare: BcryptCompare = async (data, encrypted) => {
    return await bcrypt.compare(data, encrypted);
  };
}
