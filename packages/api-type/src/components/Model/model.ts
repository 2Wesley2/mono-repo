import type { Model as MongooseModel } from "mongoose";
import type { RegisterDocumentParams, ModelRegister } from "#mongoose-wrapper";
import {
  MongooseModelRegister as Database,
  getMongooseReservedMethods,
} from "#mongoose-wrapper";

export class Model<U> {
  public model: MongooseModel<U>;
  private reservedMethods: Set<string>;

  constructor(
    public schema: RegisterDocumentParams<U>["schemaDefinition"],
    public collection: RegisterDocumentParams<U>["collection"],
    public options: RegisterDocumentParams<U>["options"],
    public middlewares: RegisterDocumentParams<U>["middlewares"],
    private database: ModelRegister = Database,
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
