import AppServer from "./resources/app-server";

const startServer = async (): Promise<void> => {
  try {
    console.log("Starting server...");
    const appServer = new AppServer();

    await appServer.start();
    console.log("Server started successfully");
    process.on("SIGINT", async () => {
      console.log("Recebido SIGINT. Encerrando servidor...");
      await appServer.shutdown();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("Recebido SIGTERM. Encerrando servidor...");
      await appServer.shutdown();
      process.exit(0);
    });
    console.log("Server started successfully");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(0);
  }
};

startServer().catch((error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});
