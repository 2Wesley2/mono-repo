import type { Schema as TSchema, SchemaDefinition } from "mongoose";
import type {
  RegisterDocumentParams,
  Options,
  MiddlewareConfig,
  IValidationService,
} from "#mongoose-wrapper/common/mongoose-types";
import {
  MongooseSchema as Schema,
  hasRequiredFields,
} from "#mongoose-wrapper/common/mongoose-common";
import { isEmptySchemaDefinition } from "#mongoose-wrapper/utils/mongoose-validation";
import { configureOptions } from "#mongoose-wrapper/utils/mongoose-options";
import {
  handleWithErrorHandling,
  throwValidationError,
} from "#mongoose-wrapper/utils/mongoose-error-handlers";
import { Validation } from "#contract-mongoose";
import type {
  IMiddlewareProcessor,
  ISchemaCreator,
  IMongooseErrorHandler,
} from "#contract-mongoose";
import mongooseErrors from "#errors-mongoose";
import {
  MAX_FIELD_COUNT,
  WARNING_FIELD_COUNT,
} from "../config/mongoose-constants";
import { createValidations } from "#mongoose-wrapper/schemas/schema-validations";

/**
 * Classe base para validações.
 */
abstract class BaseValidation extends Validation {
  protected throwError(
    errorType: typeof mongooseErrors.GenericMongooseError,
    collection: string,
    details: Record<string, any>[],
    message: string,
  ): void {
    throwValidationError(errorType, collection, details, message);
  }
}

/**
 * Validação do nome da coleção.
 */
export class CollectionNameValidation extends BaseValidation {
  public validate(params: RegisterDocumentParams<any>): void {
    if (!/^[a-zA-Z0-9-_]+$/.test(params.collection)) {
      this.throwError(
        mongooseErrors.GenericMongooseError,
        params.collection,
        [{ collection: params.collection }],
        `O nome da coleção "${params.collection}" contém caracteres inválidos.`,
      );
    }
  }
}

/**
 * Validação da contagem de campos no schema.
 */
export class FieldCountValidation extends BaseValidation {
  public validate(params: RegisterDocumentParams<any>): void {
    const fieldCount = Object.keys(params.schemaDefinition).length;
    if (fieldCount > MAX_FIELD_COUNT) {
      this.throwError(
        mongooseErrors.GenericMongooseError,
        params.collection,
        [{ fieldCount }],
        `O schema da coleção "${params.collection}" excede o limite de ${MAX_FIELD_COUNT} campos.`,
      );
    }
    if (fieldCount > WARNING_FIELD_COUNT) {
      console.warn(
        "Atenção: O schema da coleção",
        params.collection,
        "excede o limite de",
        WARNING_FIELD_COUNT,
        "campos.",
      );
    }
  }
}

/**
 * Validação da definição do schema.
 */
export class SchemaDefinitionValidation extends BaseValidation {
  public validate(params: RegisterDocumentParams<any>): void {
    if (isEmptySchemaDefinition(params.schemaDefinition)) {
      this.throwError(
        mongooseErrors.GenericMongooseError,
        params.collection,
        [{ schemaDefinition: params.schemaDefinition }],
        "Definição de schema inválida: não pode ser vazia.",
      );
    }
  }
}

/**
 * Validação para schemas sem campos obrigatórios.
 */
export class RequiredFieldsValidation extends BaseValidation {
  public validate(params: RegisterDocumentParams<any>): void {
    if (!hasRequiredFields(params.schemaDefinition)) {
      this.throwError(
        mongooseErrors.GenericMongooseError,
        params.collection,
        [{ schemaDefinition: params.schemaDefinition }],
        "O schema deve conter pelo menos um campo obrigatório.",
      );
    }
  }
}

/**
 * Fábrica para criar instâncias de validações.
 */
export const createSchemaValidations = (): Validation[] => createValidations();

/**
 * Classe responsável por criar o schema do Mongoose.
 */
export class SchemaCreator implements ISchemaCreator {
  private readonly errorHandler: IMongooseErrorHandler;
  private readonly validationService: IValidationService;

  constructor(
    errorHandler: IMongooseErrorHandler,
    validationService: IValidationService,
  ) {
    this.errorHandler = errorHandler;
    this.validationService = validationService;
  }

  public create<U>(params: RegisterDocumentParams<U>): TSchema<U> {
    return handleWithErrorHandling(
      () => {
        this.validationService.validate(params);
        return new Schema<U>(
          params.schemaDefinition,
          configureOptions(params.options),
        );
      },
      this.errorHandler,
      "SchemaCreator",
    );
  }
}

export class SchemaBuilder<U> {
  private readonly schemaCreator: ISchemaCreator;
  public readonly middlewareProcessor: IMiddlewareProcessor;

  constructor(
    schemaCreator: ISchemaCreator,
    middlewareProcessor: IMiddlewareProcessor,
  ) {
    this.schemaCreator = schemaCreator;
    this.middlewareProcessor = middlewareProcessor;
  }

  public build(
    schemaDefinition: SchemaDefinition<U>,
    collection: string,
    schemaOptions: Options,
    middlewares: MiddlewareConfig[],
  ): TSchema<U> {
    const params: RegisterDocumentParams<U> = {
      schemaDefinition,
      collection,
      options: schemaOptions,
      middlewares,
    };

    const schemaInstance = this.schemaCreator.create(params);
    return this.middlewareProcessor.process(schemaInstance, middlewares);
  }
}
