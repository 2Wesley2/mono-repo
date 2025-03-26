import {
  OverwriteModelError,
  MissingSchemaError,
  GenericMongooseError,
} from "#errors-mongoose";
import type { IMongooseErrorHandler } from "#contract-mongoose";
import { GenericError } from "./generic-error";

/**
 * Serviço para lidar com erros do Mongoose.
 */
export class MongooseErrorHandler implements IMongooseErrorHandler {
  public handle(error: unknown, collection: string): never {
    const err =
      error instanceof GenericError
        ? error
        : new GenericError(500, [{ collection }], String(error));

    if (err instanceof OverwriteModelError) {
      throw err;
    }
    if (err instanceof MissingSchemaError) {
      throw err;
    }
    throw new GenericMongooseError(
      collection,
      err.details,
      `Erro ao registrar o modelo: ${err.message}`,
    );
  }
}
