import type mongoose from "mongoose";
import {
  Model,
  HydratedDocument,
  Require_id,
  Default__v,
  SchemaDefinition,
  SchemaOptions,
  SchemaTimestampsConfig,
} from "mongoose";

export type ToObjectId = (id: string | number) => mongoose.Types.ObjectId;

/**
 * Campos padrão que podem ser adicionados a um schema do Mongoose.
 */
export type DefaultSchemaFields = {};

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

/**
 * Opções para configuração de um schema do Mongoose.
 * `timestamps` é opcional, mas será tratado como obrigatório em tempo de execução.
 * Este tipo pode ser estendido para incluir outras opções específicas no futuro.
 */
export type Options<T = any, K = any> = Omit<
  SchemaOptions<T, K, any, any, DefaultSchemaFields>,
  "timestamps"
> & {
  timestamps?: boolean | SchemaTimestampsConfig;
};

export type hookEventPre = "createCollection" | RegExp;
export type hookEventPost = "insertMany" | "bulkWrite" | RegExp;

export type PreMiddlewareConfig<T = any> = {
  readonly method: "pre";
  readonly hookEvent: hookEventPre;
  readonly fn: (this: T, ...args: any[]) => void | Promise<void>;
};

export type PostMiddlewareConfig<T = any> = {
  readonly method: "post";
  readonly hookEvent: hookEventPost;
  readonly fn: (this: T, ...args: any[]) => void | Promise<void>;
};

export type MiddlewareConfig<T = any> =
  | PreMiddlewareConfig<T>
  | PostMiddlewareConfig<T>;

export interface RegisterDocumentParams<U> {
  schemaDefinition: SchemaDefinition<U>;
  collection: string;
  options?: Options;
  middlewares: MiddlewareConfig[];
}

export interface IModelRegister {
  registerDocument<U>(params: RegisterDocumentParams<U>): Model<U>;
}

/**
 * Documento criado no Mongoose com campos adicionais padrão.
 * @template TSchema - O tipo do schema do documento.
 */
export type CreatedDocument<TSchema> = HydratedDocument<
  TSchema & {
    _id: string;
    __v: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
>;

/**
 * Documento convertido para objeto com campos adicionais padrão.
 * @template TSchema - O tipo do schema do documento.
 */
export type ToObjectDocument<TSchema> = Default__v<
  Require_id<
    TSchema & {
      createdAt?: Date;
      updatedAt?: Date;
    }
  >
>;

/**
 * Tipo para a função `configureOptions`.
 * Garante que `timestamps` nunca será `null`.
 */
export type ConfigureOptionsType = (options?: Options) => Omit<
  Options,
  "timestamps"
> & {
  timestamps: boolean | SchemaTimestampsConfig;
};

/**
 * Tipo para validação de schemas com campos opcionais.
 */
export type OptionalSchemaFields<T> = Partial<Record<keyof T, any>>;

/**
 * Interface para o serviço de validação de schemas.
 */
export interface IValidationService {
  /**
   * Valida os parâmetros de registro de um documento.
   * @param params - Parâmetros a serem validados.
   * @throws Lança erros de validação caso os parâmetros sejam inválidos.
   */
  validate(params: RegisterDocumentParams<any>): void;
}
