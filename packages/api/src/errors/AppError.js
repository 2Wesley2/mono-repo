/**
 * Classe de erro personalizada para lidar com erros específicos da aplicação.
 * Estende a classe nativa Error para incluir um código de status.
 *
 * @class AppError
 */
class AppError extends Error {
  /**
   * Cria uma instância de AppError.
   * @param {number} statusCode - Código de status HTTP representando o erro.
   * @param {string} message - Uma mensagem descritiva do erro.
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
