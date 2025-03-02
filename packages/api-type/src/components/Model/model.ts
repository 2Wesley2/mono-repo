import {
  Model as MongooseModel,
  Document as MongooseDocument,
  SchemaOptions,
} from "mongoose";
import { MongooseWrapper as Database } from "#mongoose-wrapper";
import type { IMongooseModel } from "./type-model";
import type { Middleware } from "mongoose-wrapper";

const reservedMethods: string[] = [
  "save", // Salva o documento no banco
  "find", // Realiza consultas no banco
  "findOne", // Encontra um único documento
  "findById", // Encontra um documento pelo ObjectId
  "findByIdAndUpdate", // Atualiza um documento pelo ObjectId
  "findByIdAndDelete", // Remove um documento pelo ObjectId
  "findOneAndUpdate", // Atualiza um único documento
  "findOneAndDelete", // Remove um único documento
  "updateOne", // Atualiza um único documento
  "updateMany", // Atualiza vários documentos
  "deleteOne", // Remove um único documento
  "deleteMany", // Remove vários documentos
  "remove", // Remove documentos (obsoleto, mas ainda funcional)
  "count", // Retorna a contagem de documentos (deprecated)
  "countDocuments", // Retorna a contagem de documentos
  "estimatedDocumentCount", // Retorna uma estimativa da contagem total
  "aggregate", // Realiza operações de agregação
  "populate", // Popula referências de outros documentos
  "exec", // Executa consultas e operações
  "lean", // Retorna documentos "lean" (sem métodos adicionais do Mongoose)
  "toObject", // Converte o documento para um objeto JavaScript
  "toJSON", // Converte o documento para JSON
  "create", // Cria e salva documentos
  "update", // (descontinuado) Atualiza documentos (não deve ser usado, mas ainda funciona em versões antigas)
];

export class Model<T extends MongooseDocument = MongooseDocument>
  implements IMongooseModel<T>
{
  public model: MongooseModel<MongooseDocument & T>;
  constructor(
    schema: Record<string, any> = {},
    modelName: string,
    options: SchemaOptions = {},
    middlewares: Middleware[] = [],
  ) {
    if (Object.keys(schema).length === 0) {
      throw new Error("O esquema fornecido não pode estar vazio.");
    }

    this.model = Database.registerModel({
      schema,
      modelName,
      options,
      middlewares,
    });

    this.attachCustomMethods();
  }

  static isValidObjectId(id: string): boolean {
    return Database.isValidObjectId(id);
  }

  static get getTypes() {
    return Database.getTypes;
  }

  static get objectIdType() {
    return Database.getObjectIdType;
  }

  attachCustomMethods(): void {
    const customMethods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    ).filter(
      (method) =>
        method !== "constructor" &&
        typeof (this as any)[method] === "function" &&
        !method.startsWith("_"),
    );

    customMethods.forEach((method) => {
      const isNativeMethod = Object.prototype.hasOwnProperty.call(
        Object.prototype,
        method,
      );
      if (isNativeMethod) {
        return;
      }
      if (reservedMethods.includes(method)) {
        throw new Error(
          `Método "${method}" não pode sobrescrever métodos padrão do Mongoose.`,
        );
      }
      (this.model as any)[method] = (this as any)[method].bind(this);
    });
  }
}
