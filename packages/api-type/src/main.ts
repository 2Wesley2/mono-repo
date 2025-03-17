import AppServer from "./resources/app-server";

const startServer = async (): Promise<void> => {
  try {
    const appServer = new AppServer();
    await appServer.start();
  } catch (error) {
    process.exit(0);
  }
};

startServer();
