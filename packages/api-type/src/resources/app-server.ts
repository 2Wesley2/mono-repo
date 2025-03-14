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

  constructor() {
    this.app = express();
  }
  private readonly urlServer = `http://${config.dbHost}:${config.apiPort}`;

  private async configureApp(): Promise<void> {
    try {
      console.log("Configuring app...");
      await this.connectDatabase();
      this.setPort();
      this.configureMiddlewares();
      this.setRoutes();
      this.handleErrors();
      console.log("App configured");
    } catch (error) {
      console.error("Error during app configuration:", error);
      throw error;
    }
  }

  private async connectDatabase(): Promise<void> {
    try {
      await Database.connectDB();
    } catch (error) {
      throw error;
    }
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

      const endpoints = listEndpoints(this.app);
      const port = this.app.get("port");
      console.log(chalk.blue("Available endpoints:"));
      endpoints.forEach((endpoint) => {
        endpoint.methods.forEach((method) => {
          const colorFn = methodColors[method] || chalk.white;
          console.log(
            colorFn(`[${method}]`),
            chalk.blue(`${this.urlServer}${endpoint.path}`),
          );
        });
      });
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

    return new Promise((resolve, reject) => {
      const port = this.app.get("port");

      try {
        this.server = this.app.listen(port, () => {
          resolve();
        });
      } catch (error) {
        reject(
          errors.GenericError(
            [
              {
                function: "start",
                error: error instanceof Error ? error.message : String(error),
              },
            ],
            "Failed to start server",
          ),
        );
        this.shutdown();
      }
      this.server.on("error", (error: Error) => {
        console.error(
          errors.GenericError(
            [{ function: "server.onError", error: error.message }],
            "Server encountered an error",
          ),
        );
        reject(error);
        this.shutdown();
      });
    });
  }

  public async disconnectDB(): Promise<void> {
    await Database.disconnectDB();
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

  public async shutdown(): Promise<void> {
    await Database.disconnectDB();
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
