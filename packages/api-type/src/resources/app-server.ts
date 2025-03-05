import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response, NextFunction } from "express";
import { Server as HTTPServer } from "http";
import config from "../config/index";
import { MongooseWrapper as Database } from "#mongoose-wrapper";
import errorHandler from "../middlewares/errorHandler";

export default class AppServer {
  public app: Application;
  private server!: HTTPServer;

  constructor() {
    this.app = express();
  }

  async configureApp(): Promise<void> {
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

  async connectDatabase(): Promise<void> {
    await Database.connectDB();
  }

  setPort(): void {
    const port = config.apiPort || 3009;
    this.app.set("port", port);
    console.log(`Port set to ${port}`);
  }

  configureMiddlewares(): void {
    console.log("Configuring middlewares...");
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      }),
    );
    this.app.use(cookieParser());
    console.log("Middlewares configured");
  }

  setRoutes(): void {
    try {
      console.log("Setting routes...");
      this.app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.json("Hello World");
      });
      console.log("Routes set");
    } catch (error) {
      console.error("Error setting routes:", error);
      throw error;
    }
  }

  handleErrors(): void {
    console.log("Setting error handler...");
    this.app.use(errorHandler);
    console.log("Error handler set");
  }

  async start(): Promise<void> {
    await this.configureApp();

    return new Promise((resolve, reject) => {
      const port = this.app.get("port");
      console.log(`Starting server on port ${port}`);

      this.server = this.app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        resolve();
      });

      this.server.on("error", (error: Error) => {
        console.error("Server error:", error);
        reject(error);
      });

      this.setupGracefulShutdown();
    });
  }

  async disconnectDB(): Promise<void> {
    await Database.disconnectDB();
  }

  setupGracefulShutdown(): void {
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
