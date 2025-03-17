import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response, NextFunction } from "express";
import { Server as HTTPServer } from "http";
import chalk from "chalk";
import listEndpoints from "express-list-endpoints";
import config from "../config/index";
import { MongooseWrapper as Database } from "#mongoose-wrapper";
import errorHandler from "../middlewares/errorHandler";
import { controllers } from "./modules";
import errors from "#errors";

const methodColors: { [key: string]: (text: string) => string } = {
  GET: chalk.hex("#007f31"),
  POST: chalk.hex("#ad7a03"),
  PUT: chalk.hex("#0053b8"),
  DELETE: chalk.hex("#8e1a10"),
  PATCH: chalk.hex("#623497"),
} as const;

export default class AppServer {
  public app: Application;
  private server!: HTTPServer;
  private readonly isTest: boolean = config.nodeEnv === "test";
  private readonly urlServer = `http://${config.dbHost}:${config.apiPort}`;

  constructor() {
    this.app = express();
  }

  private async configureApp(): Promise<void> {
    try {
      await this.connectDB();
      this.setPort();
      this.configureMiddlewares();
      this.setRoutes();
      this.handleErrors();
    } catch (error) {
      console.error("Error during app configuration:", error);
      throw error;
    }
  }

  private async connectDB(): Promise<void> {
    try {
      await Database.connectDB();
    } catch (error) {
      throw error;
    }
  }

  public async disconnectDB(): Promise<void> {
    await Database.disconnectDB();
  }

  private setPort(): void {
    try {
      const port = config.apiPort || 3009;
      this.app.set("port", port);
    } catch (error) {
      console.error("Error in setPort:", error);
      throw errors.GenericError(
        [
          {
            function: "setPort",
            error: error instanceof Error ? error.message : String(error),
          },
        ],
        "Failed to set port",
      );
    }
  }

  private configureMiddlewares(): void {
    try {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(
        cors({
          origin: this.urlServer,
          credentials: true,
        }),
      );
      this.app.use(cookieParser());
      this.app.use(this.logRequest.bind(this));
    } catch (error) {
      console.error("Error configuring middlewares:", error);
      throw errors.GenericError(
        [
          {
            function: "configureMiddlewares",
            error: error instanceof Error ? error.message : String(error),
          },
        ],
        "Failed to configure middlewares",
      );
    }
  }

  private setRoutes(): void {
    try {
      this.app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.json("Hello World");
      });
      this.app.use("/owner", controllers.ownerUser.getRouter());
      this.app.use("/employee", controllers.employeeUser.getRouter());
      this.app.use("/rbac", controllers.permission.getRouter());
      this.logAvailableEndpoints();
    } catch (error) {
      console.error("Error setting routes:", error);
      throw errors.GenericError(
        [
          {
            function: "setRoutes",
            error: error instanceof Error ? error.message : String(error),
          },
        ],
        "Failed to set routes",
      );
    }
  }

  private handleErrors(): void {
    try {
      this.app.use(errorHandler);
    } catch (error) {
      console.error("Error setting error handler:", error);
      throw new Error(
        `Failed to set error handler: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public async start(): Promise<void> {
    await this.configureApp();
    const port = this.app.get("port");
    try {
      this.server = this.app.listen(port, () => {
        if (!this.isTest) {
          this.setupShutdownListeners();
        }
      });
    } catch (error) {
      errors.GenericError(
        [
          {
            function: "start",
            error: error instanceof Error ? error.message : String(error),
          },
        ],
        "Failed to start server",
      ),
        await this.shutdown();
    }
  }
  public async shutdown(): Promise<void> {
    await this.disconnectDB();
    if (this.server) {
      return new Promise((resolve, reject) => {
        this.server.close((err?: Error) => {
          if (err) {
            console.error("Erro ao fechar o servidor:", err);
            return reject(err);
          }
          console.log("Servidor fechado com sucesso.");
          resolve();
        });
      });
    }
  }

  private logRequest(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const methodColored = methodColors[req.method]
        ? methodColors[req.method](req.method)
        : chalk.white(req.method);
      const urlColored = chalk.blue(`${this.urlServer}${req.originalUrl}`);
      const statusColored = chalk.yellow(res.statusCode.toString());
      console.log(
        `${methodColored} ${urlColored} - ${statusColored} - ${duration}ms`,
      );
    });
    next();
  }

  private logAvailableEndpoints(): void {
    console.log(chalk.blue("Available endpoints:"));
    listEndpoints(this.app).forEach((endpoint) => {
      endpoint.methods.forEach((method) => {
        console.log(
          methodColors[method](`[${method}]`),
          chalk.blue(`${this.urlServer}${endpoint.path}`),
        );
      });
    });
  }

  private setupShutdownListeners(): void {
    if (!this.isTest) {
      process.on("SIGINT", async () => {
        console.log("Recebido SIGINT. Encerrando servidor...");
        await this.shutdown();
        process.exit(0);
      });
      process.on("SIGTERM", async () => {
        console.log("Recebido SIGTERM. Encerrando servidor...");
        await this.shutdown();
        process.exit(0);
      });
    }
  }
}
