export type BcryptHash = (
  data: string,
  saltOrRounds: number | string,
) => Promise<string>;
export type BcryptCompare = (
  data: string,
  encrypted: string,
) => Promise<boolean>;

export interface BcryptWrapper {
  hash: BcryptHash;
  compare: BcryptCompare;
}
