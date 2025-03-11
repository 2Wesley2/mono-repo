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
    await Database.connectDB();
  }

  private setPort(): void {
    try {
      const port = config.apiPort || 3009;
      this.app.set("port", port);
    } catch (error) {
      console.error("Error in setPort:", error);
      throw new Error(
        `Failed to set port: ${error instanceof Error ? error.message : String(error)}`,
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
      throw new Error(
        `Failed to configure middlewares: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private setRoutes(): void {
    try {
      this.app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.json("Hello World");
      });
      this.app.use("/owner", controllers.ownerUser.getRouter());

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
      throw error;
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
        return reject(
          new Error(
            `Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
      this.server.on("error", (error: Error) => {
        console.error(
          new Error(`Server encountered an error: ${error.message}`),
        );
        reject(error);
      });

      this.setupGracefulShutdown();
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

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received signal ${signal}, shutting down gracefully...`);
      await this.disconnectDB();
      this.server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("Forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2"));
  }
}
