import mongoose, {
  Schema,
  SchemaDefinition,
  Model,
  Document as MongooseDocument,
  ConnectOptions,
} from "mongoose";
import config from "../../config/index";
import {
  RegisterDocumentConfigurator,
  RegisterMiddlewaresConfigurator,
} from "./type-mongoose-wrapper";

import type { MiddlewareConfig, options } from "./type-mongoose-wrapper";
export class MongooseWrapper {
  static addMiddleware(
    schema: Schema,
    middlewares: MiddlewareConfig[],
  ): RegisterMiddlewaresConfigurator<Schema> {
    return new RegisterMiddlewaresConfigurator(schema, middlewares);
  }

  static registerDocument(
    schema: SchemaDefinition,
    modelName: string,
    options: options,
    RegisterMiddlewares: MiddlewareConfig[],
  ): Model<MongooseDocument> {
    return new RegisterDocumentConfigurator(
      schema,
      modelName,
      options,
      RegisterMiddlewares,
    ).model;
  }

  static connect = async (dbName = config.dbName) => {
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
  };

  static disconnect = async () => {
    try {
      await mongoose.connection.close();
      console.log("Conexão com o banco de dados encerrada.");
    } catch (error: any) {
      console.error("Erro ao encerrar a conexão:", error);
    }
  };
}
