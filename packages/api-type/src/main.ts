import AppServer from "./resources/app-server";

const startServer = async (): Promise<void> => {
  try {
    console.log("Starting server...");
    const appServer = new AppServer();
    await appServer.start();
    console.log("Server started successfully");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(0);
  }
};

startServer();
