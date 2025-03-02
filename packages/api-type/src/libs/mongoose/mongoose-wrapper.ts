import mongoose, {
  Schema,
  Model,
  Document as MongooseDocument,
  ConnectOptions,
  PreMiddlewareFunction,
  PostMiddlewareFunction,
  SchemaOptions,
} from "mongoose";
import config from "../../config/index";
import type {
  Middleware,
  AddMiddleware,
  RegisterModel,
  ConfigSchema,
  SubSchema,
} from "./type-mongoose-wrapper";

export class MongooseWrapper {
  static addMiddleware: AddMiddleware["addMiddleware"] = (
    schema,
    type,
    event,
    fn,
  ) => {
    if (!schema || !(schema instanceof Schema)) {
      throw new Error(
        "O primeiro argumento deve ser um schema Mongoose válido.",
      );
    }
    if (!["pre", "post"].includes(type)) {
      throw new Error(
        `O tipo de middleware "${type}" é inválido. Use "pre" ou "post".`,
      );
    }
    if (typeof event !== "string" || typeof fn !== "function") {
      throw new Error(
        'Os argumentos "event" e "fn" devem ser uma string e uma função, respectivamente.',
      );
    }
    if (type === "pre") {
      schema.pre(event, fn as PreMiddlewareFunction<any>);
    } else {
      schema.post(event, fn as PostMiddlewareFunction<any>);
    }
  };

  static async connect(dbName: string = config.dbName): Promise<void> {
    if (!dbName) {
      throw new Error("O nome do banco de dados não pode ser undefined.");
    }

    let dbUri: string;
    const options: ConnectOptions = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    };

    try {
      if (config.dbAtlas) {
        if (!config.dbUser || !config.dbPassword || !config.dbHost) {
          throw new Error("Configurações do Atlas estão incompletas.");
        }
        dbUri = `mongodb+srv://${encodeURIComponent(config.dbUser)}:${encodeURIComponent(config.dbPassword)}@${config.dbHost}/${dbName}?retryWrites=true&w=majority`;
        console.log(`MongoDB conectado ao banco ${dbName} no Atlas.`);
      } else if (config.dbHost && config.dbPort) {
        dbUri = `mongodb://${config.dbHost}:${config.dbPort}/${dbName}`;
        console.log(
          `MongoDB conectado ao banco ${dbName} na porta ${config.dbPort}.`,
        );
      } else {
        throw new Error(
          "Configuração do banco de dados inválida. Verifique dbAtlas ou dbHost e dbPort.",
        );
      }

      await mongoose.connect(dbUri, options);

      mongoose.connection.on("connected", () => {
        console.log(`Mongoose conectado a ${dbUri}`);
      });

      mongoose.connection.on("error", (err: Error) => {
        console.error("Erro na conexão com o MongoDB:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("Mongoose desconectado.");
      });
    } catch (error: any) {
      console.error(`Falha ao conectar ao banco ${dbName}:`, error.message);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log("Conexão com o banco de dados encerrada.");
    } catch (error: any) {
      console.error("Erro ao encerrar a conexão:", error);
    }
  }

  static configSchema: ConfigSchema["configSchema"] = ({
    schema,
    options = {},
    middlewares = [],
  }) => {
    const newSchema: Schema = new Schema(schema, options);
    middlewares.forEach(({ type, event, fn }) => {
      this.addMiddleware(newSchema, type, event, fn);
    });
    return newSchema;
  };

  static subSchema: SubSchema["subSchema"] = (
    definition,
    options = {},
    middlewares = [],
  ) => {
    const opts = { _id: false, ...options };
    const subSchema: Schema = new Schema(definition, opts);
    middlewares.forEach(({ type, event, fn }) => {
      this.addMiddleware(subSchema, type, event, fn);
    });
    return subSchema;
  };

  static registerModel: RegisterModel["registerModel"] = <
    T extends MongooseDocument,
  >({
    schema,
    modelName,
    options = {},
    middlewares = [],
  }: {
    schema: Record<string, any>;
    modelName: string;
    options?: SchemaOptions;
    middlewares?: Middleware[];
  }): Model<MongooseDocument & T> => {
    if (!schema || typeof schema !== "object") {
      throw new Error("Schema inválido ou não fornecido.");
    }

    if (!modelName || typeof modelName !== "string") {
      throw new Error(
        `O nome do modelo deve ser uma string válida. Recebido: ${modelName}`,
      );
    }

    if (mongoose.models[modelName]) {
      console.log(`Modelo "${modelName}" já está registrado.`);
      return mongoose.models[modelName] as Model<T>;
    }
    const newOptions = { timestamps: true, ...options };
    const newSchema: Schema = this.configSchema({
      schema,
      options: newOptions,
      middlewares,
    });
    const model: Model<T> = mongoose.model<T>(modelName, newSchema);
    return model;
  };

  static get ObjectIdTypeMongoose() {
    return mongoose.Schema.Types.ObjectId;
  }

  static get TypesMongoose() {
    return mongoose.Schema.Types;
  }

  static isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static toObjectId(...values: (string | number)[]): mongoose.Types.ObjectId[] {
    return values.map((value) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(String(value));
      }
      throw new Error(`O valor fornecido (${value}) não é um ObjectId válido.`);
    });
  }

  static async dropDatabase(...dbNames: string[]): Promise<void> {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Não há conexão ativa com o MongoDB.");
    }

    try {
      for (const dbName of dbNames) {
        if (typeof dbName !== "string" || !dbName) {
          throw new Error(
            "O nome do banco de dados deve ser uma string válida.",
          );
        }
        const dbConnection = mongoose.connection.useDb(dbName);
        await dbConnection.dropDatabase();
        console.log(`Banco de dados "${dbName}" excluído com sucesso.`);
      }
    } catch (error: any) {
      console.error(`Erro ao excluir o banco de dados:`, error);
      throw error;
    }
  }

  static get getTypes() {
    return mongoose.Schema.Types;
  }

  static get getObjectIdType() {
    return mongoose.Schema.Types.ObjectId;
  }
}
