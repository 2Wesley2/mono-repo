import AppServer from "./resources/app-server";

const startServer = async (): Promise<void> => {
  try {
    const appServer = new AppServer();
    await appServer.start();
  } catch (error) {
    process.exit(0);
  }
};

startServer().catch((error) => {
  console.error("Erro ao iniciar o servidor:");
  console.error("Mensagem:", error.message);
  console.error("Stack:", error.stack);
  process.exit(1);
});
