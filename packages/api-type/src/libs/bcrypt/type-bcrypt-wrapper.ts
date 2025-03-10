export type BcryptHash = (saltOrRounds: number | string) => Promise<string>;
export type BcryptCompare = (encrypted: string) => Promise<boolean>;
