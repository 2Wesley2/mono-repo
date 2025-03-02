import {
  AddMiddleware,
  ConfigSchema,
  SubSchema,
  RegisterModel,
} from "./type-mongoose-wrapper";

declare module "mongoose-wrapper" {
  export class MongooseWrapper {
    static addMiddleware: AddMiddleware["addMiddleware"];
    static connect(dbName?: string): Promise<void>;
    static disconnect(): Promise<void>;
    static configSchema: ConfigSchema["configSchema"];
    static subSchema: SubSchema["subSchema"];
    static registerModel: RegisterModel["registerModel"];
    static readonly ObjectIdTypeMongoose: typeof import("mongoose").Schema.Types.ObjectId;
    static readonly TypesMongoose: typeof import("mongoose").Schema.Types;
    static isValidObjectId(id: string): boolean;
    static toObjectId(
      ...values: (string | number)[]
    ): import("mongoose").Types.ObjectId[];
    static dropDatabase(...dbNames: string[]): Promise<void>;
    static readonly getTypes: typeof import("mongoose").Schema.Types;
    static readonly getObjectIdType: typeof import("mongoose").Schema.Types.ObjectId;
  }
}
