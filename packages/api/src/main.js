/**
 * Importa a classe principal do aplicativo, responsável pela configuração e inicialização.
 */
import App from './resources/app.js';

/**
 * Importa a classe do servidor, responsável por gerenciar a inicialização e o desligamento.
 */
import Server from './resources/server.js';

/**
 * Importa o módulo de depuração para registro de logs.
 */
import debug from './debug/index.js';

/**
 * Função principal que inicializa e inicia o servidor.
 * @async
 * @returns {Promise<void>} Promessa resolvida quando o servidor for iniciado com sucesso ou rejeitada em caso de erro.
 * @example
 * startServer();
 */
const startServer = async () => {
  try {
    /**
     * Instância da classe App, responsável pela configuração da aplicação.
     * @type {App}
     */
    const app = new App();

    /**
     * Instância da classe Server, responsável por gerenciar o servidor.
     * @type {Server}
     */
    const server = new Server(app);

    await server.init();
    await server.start();
    debug.logger.info('main.js: Servidor iniciado com sucesso.');
  } catch (error) {
    debug.logger.error('main.js: Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

/**
 * Inicia o processo principal.
 */
startServer();
