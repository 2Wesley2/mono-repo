import mongoose, {
  Schema,
  SchemaDefinition,
  Model,
  Document as MongooseDocument,
  ConnectOptions,
  connect,
} from "mongoose";
import config from "../../config/index";
import {
  RegisterDocumentConfigurator,
  RegisterMiddlewaresConfigurator,
  registerConnectionEvents,
} from "./type-mongoose-wrapper";
import type {
  ConnectionDBType,
  MiddlewareConfig,
  ConnectionEvents,
  options,
} from "./type-mongoose-wrapper";
import { MongooseWrapper as IMongooseWrapper } from "./mongoose-wrapper";
const options: ConnectOptions = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
};

const connectionEvents: ConnectionEvents = {
  connecting: () => console.log("Mongoose iniciando o processo de conexão..."),
  connected: () => console.log("Mongoose conectado com sucesso."),
  open: () => console.log("Conexão aberta e pronta para uso."),
  disconnecting: () =>
    console.log("Mongoose iniciando o processo de desconexão..."),
  disconnected: () => console.log("Mongoose desconectado."),
  close: () => console.log("Conexão fechada."),
  reconnected: () => console.log("Mongoose reconectado após perda de conexão."),
  error: (err: Error) => console.error("Erro na conexão com o MongoDB:", err),
};

export class MongooseWrapper implements IMongooseWrapper {
  public static addMiddleware(
    schema: Schema,
    middlewares: MiddlewareConfig[],
  ): RegisterMiddlewaresConfigurator<Schema> {
    return new RegisterMiddlewaresConfigurator(schema, middlewares);
  }

  public static registerDocument(
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

  public static connectDB: ConnectionDBType = async (
    dbName = config.dbName,
  ): Promise<void> => {
    if (!dbName) {
      throw new Error("O nome do banco de dados não pode ser undefined.");
    }

    let dbUri: string;

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
      registerConnectionEvents(connectionEvents);
      await connect(dbUri, options);
    } catch (error: Error | any) {
      throw error;
    }
  };

  public static disconnectDB: ConnectionDBType = async (): Promise<void> => {
    try {
      await mongoose.connection.close();
    } catch (error: Error | any) {
      throw error;
    }
  };
}
