import bcrypt from "bcrypt";
import { BcryptHash, BcryptCompare } from "#bcrypt-type";

export class BcryptWrapper {
  public hash: BcryptHash = async (
    data: string,
    saltOrRounds: number | string,
  ) => {
    return await bcrypt.hash(data, saltOrRounds);
  };

  public compare: BcryptCompare = async (data: string, encrypted: string) => {
    return await bcrypt.compare(data, encrypted);
  };
}
