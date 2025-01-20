import fs from 'fs';

/**
 * Importações necessárias para o carregamento e gerenciamento do servidor.
 */
import loaders from '../core/loaders/index.js';
import { listServerEndpoints } from '../helpers/listEndpointsHelper.js';
import debug from '../debug/index.js';

/**
 * Classe responsável por gerenciar a inicialização e o encerramento do servidor.
 */
export default class Server {
  /**
   * Inicializa uma nova instância da classe Server.
   * @param {Object} app - A instância da aplicação principal.
   */
  constructor(app) {
    /**
     * A instância da aplicação principal.
     * @type {Object}
     */
    this.app = app;

    /**
     * A instância configurada do Express dentro da aplicação.
     * @type {Object}
     */
    this.appInstance = app.getInstance();
  }

  /**
   * Inicializa o servidor configurando a aplicação e lista os endpoints.
   * @async
   * @returns {Promise<void>} Promessa resolvida após a configuração da aplicação.
   */
  async init() {
    await this.app.configureApp();
    this.logEndpoints();
  }

  /**
   * Inicia o servidor na porta configurada e define o gerenciamento de erros e desligamento.
   * @returns {Promise<void>} Promessa resolvida quando o servidor iniciar com sucesso.
   */
  start() {
    return new Promise((resolve, reject) => {
      const port = this.appInstance.get('port');

      // Configurar opções de HTTPS
      const httpsOptions = {
        key: fs.readFileSync('./key1.pem'),
        cert: fs.readFileSync('./cert1.pem'),
      };
      /**
       * Instância do servidor HTTP.
       * @type {Object}
       */
      this.server = this.appInstance.listen(port, () => {
        debug.logger.info(`server.js: Servidor rodando na porta: ${port}`);
        resolve();
      });

      this.appInstance.set('httpsOptions', httpsOptions);
      this.server.on('error', (error) => {
        reject(error);
      });

      this.setupGracefulShutdown();
    });
  }

  /**
   * Lista todos os endpoints configurados no servidor.
   */
  logEndpoints() {
    listServerEndpoints(this.appInstance);
    debug.logger.info('server.js: Endpoints do servidor listados.');
  }

  /**
   * Desconecta o banco de dados de maneira assíncrona.
   * @async
   * @returns {Promise<void>} Promessa resolvida após a desconexão do banco de dados.
   */
  async disconnectDB() {
    await loaders.mongoose.disconnect();
  }

  /**
   * Configura o desligamento do servidor ao receber sinais do sistema.
   */
  setupGracefulShutdown() {
    /**
     * Gerencia o encerramento gracioso do servidor.
     * @param {string} signal - O sinal recebido para encerrar o servidor.
     */
    const gracefulShutdown = async (signal) => {
      debug.logger.warn(`server.js: Recebido sinal ${signal}, desligando...`);
      await this.disconnectDB();
      this.server.close(() => {
        debug.logger.info('server.js: Todas as conexões foram encerradas.');
        process.exit(0);
      });

      setTimeout(() => {
        debug.logger.error('server.js: Forçando encerramento após 10 segundos.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
  }
}
