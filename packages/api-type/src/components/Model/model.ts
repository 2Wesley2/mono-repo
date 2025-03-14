import { Model as MongooseModel } from "mongoose";
import {
  MongooseWrapper as Database,
  RegisterDocumentParams,
} from "#mongoose-wrapper";

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
] as const;

export class Model<U> {
  public model: MongooseModel<U>;
  constructor(
    public schema: RegisterDocumentParams<U>["schemaDefinition"],
    public modelName: RegisterDocumentParams<U>["collection"],
    public options: RegisterDocumentParams<U>["options"],
    public middlewares: RegisterDocumentParams<U>["middlewares"],
  ) {
    if (Object.keys(schema).length === 0) {
      throw new Error("O esquema fornecido não pode estar vazio.");
    }

    this.model = Database.registerDocument(
      schema,
      modelName,
      options || {},
      middlewares || [],
    );

    this.attachCustomMethods();
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
