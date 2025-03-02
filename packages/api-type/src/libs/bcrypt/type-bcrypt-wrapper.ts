export interface BcryptHashParams {
  data: string;
  saltOrRounds: number | string;
}

export interface BcryptCompareParams {
  data: string;
  encrypted: string;
}

export type BcryptHash = (
  data: BcryptHashParams["data"],
  saltOrRounds: BcryptHashParams["saltOrRounds"],
) => Promise<string>;

export type BcryptCompare = (
  data: BcryptCompareParams["data"],
  encrypted: BcryptCompareParams["encrypted"],
) => Promise<boolean>;
