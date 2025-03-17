import AppServer from "./resources/app-server";

const startServer = async (): Promise<void> => {
  try {
    const appServer = new AppServer();
    await appServer.start();
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(0);
  }
};

startServer();
