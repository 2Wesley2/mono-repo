import bcrypt from "bcrypt";
import { BcryptHash, BcryptCompare, IBcryptWrapper } from "#bcrypt-type";

export class BcryptWrapper implements IBcryptWrapper {
  public hash: BcryptHash = async (
    data: string,
    saltOrRounds: number | string,
  ): Promise<string> => {
    return await bcrypt.hash(data, saltOrRounds);
  };

  public compare: BcryptCompare = async (
    data: string,
    encrypted: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(data, encrypted);
  };
}
