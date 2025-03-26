import mongooseErrors from "#errors-mongoose";
import { GenericError } from "./generic-error";

/**
 * Serviço para lidar com erros do Mongoose.
 */
export class MongooseErrorHandler {
  public handle(error: unknown, collection: string): never {
    const err =
      error instanceof GenericError
        ? error
        : new GenericError(500, [{ collection }], String(error));

    if (err instanceof mongooseErrors.OverwriteModelError) {
      throw err;
    }
    if (err instanceof mongooseErrors.MissingSchemaError) {
      throw err;
    }
    throw mongooseErrors.GenericMongooseError(
      collection,
      err.details,
      `Erro ao registrar o modelo: ${err.message}`,
    );
  }
}
