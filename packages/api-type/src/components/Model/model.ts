import type { Model as MongooseModel } from "mongoose";
import type { RegisterDocumentParams } from "#mongoose-wrapper/mongoose-types";
import {
  ModelRegister,
  ModelFactory,
  MongooseModelRegister,
} from "#mongoose-wrapper/mongoose-model-register";
import {
  SchemaCreator,
  SchemaBuilder,
} from "#mongoose-wrapper/mongoose-schema-config";
import { getMongooseReservedMethods } from "#mongoose-wrapper/mongoose-common";
import {
  MiddlewareContext,
  MiddlewareValidationContext,
  MiddlewareValidatorService,
  MiddlewareProcessor,
} from "#mongoose-wrapper/mongoose-middlewares";

import { MongooseErrorHandler } from "#mongoose-error-handler";

export class Model<U extends Record<string, any>> {
  public model: MongooseModel<U>;
  private reservedMethods: Set<string>;

  constructor(
    public schema: RegisterDocumentParams<U>["schemaDefinition"],
    public collection: RegisterDocumentParams<U>["collection"],
    public options: RegisterDocumentParams<U>["options"],
    public middlewares: RegisterDocumentParams<U>["middlewares"],
    private database: MongooseModelRegister<U> = new MongooseModelRegister<U>(
      new SchemaBuilder<U>(
        new SchemaCreator(new MongooseErrorHandler()),
        new MiddlewareProcessor(
          new MiddlewareContext(),
          new MiddlewareValidationContext(),
          new MiddlewareValidatorService(),
        ),
      ),
      new ModelRegister<U>(new MongooseErrorHandler(), new ModelFactory<U>()),
    ),
  ) {
    this.reservedMethods = getMongooseReservedMethods();

    this.validateSchema(schema);
    this.model = this.database.registerDocument(
      schema,
      collection,
      options || {},
      middlewares || [],
    );

    this.attachCustomMethods();
  }

  private validateSchema(
    schema: RegisterDocumentParams<U>["schemaDefinition"],
  ): void {
    if (
      !schema ||
      typeof schema !== "object" ||
      Object.keys(schema).length === 0
    ) {
      throw new Error("O esquema fornecido não pode estar vazio ou inválido.");
    }
  }

  private attachCustomMethods(): void {
    const customMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    ).filter(
      (method) =>
        method !== "constructor" &&
        typeof (this as any)[method] === "function" &&
        !method.startsWith("_"),
    );

    customMethods.forEach((method) => {
      if (this.reservedMethods.has(method)) {
        throw new Error(
          `Método "${method}" não pode sobrescrever métodos padrão do Mongoose.`,
        );
      }
      (this.model as any)[method] = (this as any)[method].bind(this);
    });
  }
}
