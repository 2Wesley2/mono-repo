import config from '../config/index.js';
import AppError from '../errors/AppError.js';

/**
 * Middleware para tratamento de erros na aplicação.
 *
 * Utiliza a classe AppError para lidar com erros personalizados erros gerais, enviando uma resposta adequada ao cliente.
 *
 * @param {Error} err - O erro capturado.
 * @param {Request} _req - O objeto de requisição (não utilizado).
 * @param {Response} res - O objeto de resposta.
 * @param {Function} _next - A função next do middleware (não utilizada).
 *
 * @example
 * app.use((err, req, res, next) => {
 *   errorHandlingMiddleware(err, req, res, next);
 * });
 */
export default (err, _req, res, _next) => {
  /**
   * Determina o código de status HTTP baseado no tipo de erro.
   * @type {number}
   */
  const statusCode = err instanceof AppError && err.statusCode ? err.statusCode : 500;

  /**
   * Determina a mensagem de erro a ser enviada na resposta.
   * @type {string}
   */
  const message = err instanceof AppError && err.message ? err.message : 'Internal Server Error';

  if (config.nodeEnv !== 'production') {
    console.error(err);
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: err.stack,
    });
  } else {
    console.error(err.message);
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
    });
  }
};
