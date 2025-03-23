import mongoose, {
  SchemaDefinition,
  SchemaOptions,
  HydratedDocument,
  Require_id,
  Default__v,
} from "mongoose";

export type Default = {};

export type ConnectionDBType = (dbName?: string | undefined) => Promise<void>;

export type ConnectionEvents<ErrorType = Error> = Record<
  | "connecting"
  | "connected"
  | "open"
  | "disconnecting"
  | "disconnected"
  | "close"
  | "reconnected",
  () => void
> & {
  error: (err: ErrorType) => void;
};

export type RegisterConnectionEventsFunction = <ErrorType = Error>(
  events: ConnectionEvents<ErrorType>,
) => void;

export type options = SchemaOptions<any, any, any, any, Default>;
export type hookEventPre = "createCollection" | RegExp;
export type hookEventPost =
  | "createCollection"
  | "insertMany"
  | "bulkWrite"
  | RegExp;

export type PreMiddlewareConfig = {
  readonly method: "pre";
  readonly hookEvent: hookEventPre;
  readonly fn: (...args: any[]) => void | Promise<void>;
};

export type PostMiddlewareConfig = {
  readonly method: "post";
  readonly hookEvent: hookEventPost;
  readonly fn: (...args: any[]) => void | Promise<void>;
};

export type MiddlewareConfig = PreMiddlewareConfig | PostMiddlewareConfig;

export interface RegisterDocumentParams<U> {
  schemaDefinition: SchemaDefinition<U>;
  collection: string;
  options?: options;
  middlewares: MiddlewareConfig[];
}

export type ToObjectId = (id: string) => mongoose.Types.ObjectId;

export type CreatedDocument<TSchema> = HydratedDocument<
  TSchema & {
    _id: string;
    __v: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
>;

export type ToObjectDocument<TSchema> = Default__v<
  Require_id<
    TSchema & {
      createdAt?: Date;
      updatedAt?: Date;
    }
  >
>;
