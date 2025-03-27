import mongoose from "mongoose";
import type { ConnectOptions, Model } from "mongoose";

export class MongooseConnection {
  private static instance: MongooseConnection;
  private readonly config: any;
  private readonly httpErrors: any;
  private readonly mongooseErrors: any;

  private constructor(config: any, httpErrors: any, mongooseErrors: any) {
    this.config = config;
    this.httpErrors = httpErrors;
    this.mongooseErrors = mongooseErrors;
  }

  public static getInstance(
    config?: any,
    httpErrors?: any,
    mongooseErrors?: any,
  ): MongooseConnection {
    if (!MongooseConnection.instance) {
      if (!config || !httpErrors || !mongooseErrors) {
        throw new Error(
          "Configuração necessária para inicializar MongooseConnection.",
        );
      }
      MongooseConnection.instance = new MongooseConnection(
        config,
        httpErrors,
        mongooseErrors,
      );
    }
    return MongooseConnection.instance;
  }

  async connectDB(dbName = this.config.dbName): Promise<void> {
    this.validateDbName(dbName);

    const dbUri = this.buildDbUri(dbName);
    const options: ConnectOptions = {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
    };

    await this.handleWithError(
      async () => {
        await mongoose.connect(dbUri, options);
        this.registerEventHandlers(dbUri);
      },
      dbName,
      "Falha ao conectar ao banco de dados",
    );
  }

  async disconnectDB(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log("Conexão com o banco de dados encerrada.");
    } catch (error: any) {
      throw this.httpErrors.InternalServerError(
        [{ function: "disconnectDB", originalError: error.message }],
        "Erro ao encerrar a conexão com o banco de dados",
      );
    }
  }

  getCollectionByName<T>(collectionName: string): Model<T> {
    if (!mongoose.modelNames().includes(collectionName)) {
      throw new this.mongooseErrors.MissingSchemaError(
        collectionName,
        `Modelo '${collectionName}' não encontrado.`,
      );
    }
    return mongoose.model<T>(collectionName);
  }

  async deleteDB(dbName: string): Promise<void> {
    this.validateDbName(dbName);
    await this.handleWithError(
      async () => {
        const db = mongoose.connection.useDb(dbName);
        console.log(`Tentando deletar o banco de dados: ${dbName}`);
        await db.dropDatabase();
        console.log(`Banco de dados ${dbName} deletado com sucesso.`);
      },
      dbName,
      "Falha ao deletar o banco de dados",
    );
  }

  private validateDbName(dbName: string): void {
    if (!dbName) {
      throw this.httpErrors.BadRequest(
        [],
        "O nome do banco de dados não pode ser undefined.",
      );
    }
  }

  private buildDbUri(dbName: string): string {
    if (this.config.dbAtlas) {
      if (
        !this.config.dbUser ||
        !this.config.dbPassword ||
        !this.config.dbHost
      ) {
        throw this.httpErrors.BadRequest(
          [],
          "Configurações do Atlas estão incompletas.",
        );
      }
      console.log(`MongoDB conectado ao banco ${dbName} no Atlas.`);
      return `mongodb+srv://${encodeURIComponent(this.config.dbUser)}:${encodeURIComponent(this.config.dbPassword)}@${this.config.dbHost}/${dbName}?retryWrites=true&w=majority`;
    } else if (this.config.dbHost && this.config.dbPort) {
      console.log(
        `MongoDB conectado ao banco ${dbName} na porta ${this.config.dbPort}.`,
      );
      return `mongodb://${this.config.dbHost}:${this.config.dbPort}/${dbName}`;
    } else {
      throw this.httpErrors.BadRequest(
        [],
        "Configuração do banco de dados inválida. Verifique dbAtlas ou dbHost e dbPort.",
      );
    }
  }

  private registerEventHandlers(dbUri: string): void {
    mongoose.connection.on("connected", () => {
      console.log(`Mongoose conectado a ${dbUri}`);
    });
    mongoose.connection.on("error", (err: Error) => {
      console.error("Erro na conexão com o MongoDB:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose desconectado.");
    });
  }

  private async handleWithError(
    fn: () => Promise<void>,
    context: string,
    errorMessage: string,
  ): Promise<void> {
    try {
      await fn();
    } catch (error: any) {
      throw new this.mongooseErrors.GenericMongooseError(
        context,
        [{ originalError: error.message }],
        errorMessage,
      );
    }
  }
}
