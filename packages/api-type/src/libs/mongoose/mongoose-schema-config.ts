import type { Schema as TSchema, SchemaDefinition } from "mongoose";
import type {
  RegisterDocumentParams,
  options,
  MiddlewareConfig,
} from "#mongoose-wrapper/mongoose-types";
import {
  MongooseSchema as Schema,
  throwValidationError,
  isValidSchemaDefinition,
  ValidationContext,
  configureOptions,
  handleWithErrorHandling,
} from "#mongoose-wrapper/mongoose-utils";
import { Validation } from "#contract-mongoose";
import type {
  IMiddlewareProcessor,
  ISchemaCreator,
  IMongooseErrorHandler,
} from "#contract-mongoose";
import mongooseErrors from "#errors-mongoose";

/**
 * Validação do nome da coleção.
 */
export class CollectionNameValidation extends Validation {
  public validate(params: RegisterDocumentParams<any>): void {
    if (!/^[a-zA-Z0-9-_]+$/.test(params.collection)) {
      throwValidationError(
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
export class FieldCountValidation extends Validation {
  public validate(params: RegisterDocumentParams<any>): void {
    const fieldCount = Object.keys(params.schemaDefinition).length;
    if (fieldCount > 10000) {
      throwValidationError(
        mongooseErrors.GenericMongooseError,
        params.collection,
        [{ fieldCount }],
        `O schema para a coleção "${params.collection}" excede o limite de 10.000 campos.`,
      );
    }
    if (fieldCount > 500) {
      console.warn(
        `Aviso: O schema para a coleção "${params.collection}" contém ${fieldCount} campos.`,
      );
    }
  }
}

/**
 * Validação da definição do schema.
 */
export class SchemaDefinitionValidation extends Validation {
  public validate(params: RegisterDocumentParams<any>): void {
    if (!isValidSchemaDefinition(params.schemaDefinition)) {
      throwValidationError(
        mongooseErrors.GenericMongooseError,
        params.collection,
        [{ schemaDefinition: params.schemaDefinition }],
        "Definição de schema inválida.",
      );
    }
  }
}

/**
 * Aplica validações padrão para os parâmetros de registro de documentos.
 * @param params - Parâmetros fornecidos para o registro do documento.
 * @throws Lança erros de validação, se aplicável.
 */
export const applyValidations = (params: RegisterDocumentParams<any>): void => {
  const validationContext = new ValidationContext();
  validationContext.addValidation(new SchemaDefinitionValidation());
  validationContext.addValidation(new CollectionNameValidation());
  validationContext.addValidation(new FieldCountValidation());
  validationContext.validate(params);
};

/**
 * Classe responsável por criar o schema do Mongoose.
 */
export class SchemaCreator implements ISchemaCreator {
  private readonly errorHandler: IMongooseErrorHandler;

  constructor(errorHandler: IMongooseErrorHandler) {
    this.errorHandler = errorHandler;
  }

  public create<U>(params: RegisterDocumentParams<U>): TSchema<U> {
    return handleWithErrorHandling(
      () => {
        applyValidations(params);
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
    schemaOptions: options,
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
