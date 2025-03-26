import mongoose from "mongoose";
import type { ConnectOptions, Model } from "mongoose";
import config from "#config";
import httpErrors from "#http-errors";
import mongooseErrors from "#errors-mongoose";

export class MongooseConnection {
  static async connectDB(dbName = config.dbName): Promise<void> {
    if (!dbName) {
      throw httpErrors.BadRequest(
        [],
        "O nome do banco de dados não pode ser undefined.",
      );
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
          throw httpErrors.BadRequest(
            [],
            "Configurações do Atlas estão incompletas.",
          );
        }
        dbUri = `mongodb+srv://${encodeURIComponent(config.dbUser)}:${encodeURIComponent(config.dbPassword)}@${config.dbHost}/${dbName}?retryWrites=true&w=majority`;
        console.log(`MongoDB conectado ao banco ${dbName} no Atlas.`);
      } else if (config.dbHost && config.dbPort) {
        dbUri = `mongodb://${config.dbHost}:${config.dbPort}/${dbName}`;
        console.log(
          `MongoDB conectado ao banco ${dbName} na porta ${config.dbPort}.`,
        );
      } else {
        throw httpErrors.BadRequest(
          [],
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
      throw new mongooseErrors.GenericMongooseError(
        dbName,
        [{ originalError: error.message }],
        "Falha ao conectar ao banco de dados",
      );
    }
  }

  static async disconnectDB(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log("Conexão com o banco de dados encerrada.");
    } catch (error: any) {
      throw httpErrors.InternalServerError(
        [{ function: "disconnectDB", originalError: error.message }],
        "Erro ao encerrar a conexão com o banco de dados",
      );
    }
  }

  static getCollectionByName<T>(collectionName: string): Model<T> {
    if (!mongoose.modelNames().includes(collectionName)) {
      throw new mongooseErrors.MissingSchemaError(
        collectionName,
        `Modelo '${collectionName}' não encontrado.`,
      );
    }
    return mongoose.model<T>(collectionName);
  }

  static async deleteDB(dbName: string): Promise<void> {
    if (!dbName) {
      throw httpErrors.BadRequest(
        [],
        "O nome do banco de dados não pode ser undefined.",
      );
    }
    try {
      const db = mongoose.connection.useDb(dbName);
      await db.dropDatabase();
    } catch (error: any) {
      throw new mongooseErrors.GenericMongooseError(
        dbName,
        [{ originalError: error.message }],
        "Falha ao deletar o banco de dados",
      );
    }
  }
}
