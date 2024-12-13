/**
 * Importa e centraliza as variáveis de ambiente definidas no arquivo "env.js".
 * Este arquivo simplifica a reutilização das configurações de ambiente em outros módulos.
 */
import env from './env.js';

export default {
  /**
   * Exporta todas as variáveis de ambiente desestruturadas do módulo "env".
   * @returns {Object} Um objeto contendo todas as configurações de ambiente.
   * @example
   * import config from './config.js';
   * console.log(config.apiPort); // Porta da API
   */
  ...env,
};
