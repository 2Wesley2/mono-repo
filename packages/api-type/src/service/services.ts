import type {
  SignOptions,
  JwtPayload,
  VerifyOptions,
  DecodeOptions,
} from "jsonwebtoken";
import { MongooseConnection, toObjectId } from "#mongoose-wrapper";
import { SRole } from "#schema";
import { BcryptWrapper } from "#bcrypt-wrapper";
import { JSONWebTokenWrapper } from "#jwt-wrapper";
import type { BcryptWrapper as TypeBcryptWrapper } from "#bcrypt-wrapper";
import type { JSONWebTokenWrapper as TypeJSONWebTokenWrapper } from "#jwt-wrapper";

export class Services {
  private bcryptWrapper: TypeBcryptWrapper;
  private jwtWrapper: TypeJSONWebTokenWrapper;

  constructor() {
    this.bcryptWrapper = new BcryptWrapper();
    this.jwtWrapper = new JSONWebTokenWrapper();
  }

  protected async hash(data: string, saltOrRounds: number): Promise<string> {
    return await this.bcryptWrapper.hash(data, saltOrRounds);
  }

  protected async compare(data: string, encrypted: string): Promise<boolean> {
    return await this.bcryptWrapper.compare(data, encrypted);
  }

  protected signJWT(payload: JwtPayload, options?: SignOptions): string {
    return this.jwtWrapper.sign(payload, options);
  }

  protected verifyJWT<T extends JwtPayload = JwtPayload>(
    token: string,
    options?: VerifyOptions,
  ): T {
    const result = this.jwtWrapper.verify(token, options);
    if (typeof result === "string") {
      throw new Error("Token inválido ou malformado");
    }
    return result as T;
  }

  protected decodeJWT(token: string, options?: DecodeOptions) {
    return this.jwtWrapper.decode(token, options);
  }

  protected async can(permission: string, userId: string): Promise<boolean> {
    permission = permission.toUpperCase();
    const userIdObj = toObjectId(userId);
    const RoleModel = MongooseConnection.getCollectionByName<SRole>("Role");
    const role = await RoleModel.findOne({ owner_id: userIdObj })
      .select("permissions")
      .lean();
    if (!role) return false;

    return role.permissions.some(
      (perm: { name: string }) => perm.name === permission,
    );
  }
}
