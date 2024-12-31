import config from '../config/index.js';
import { BaseError } from '../errors/Exceptions.js'; // Certifique-se de que Exceptions.js exporta BaseError corretamente.

/**
 * Middleware para tratamento de erros na aplicação.
 *
 * Utiliza classes derivadas de BaseError para capturar erros personalizados e erros gerais, enviando uma resposta adequada ao cliente.
 *
 * @param {Error} err - O erro capturado.
 * @param {Request} _req - O objeto de requisição (não utilizado).
 * @param {Response} res - O objeto de resposta.
 * @param {Function} _next - A função next do middleware (não utilizada).
 */
export default (err, _req, res, _next) => {
  /**
   * Determina o código de status HTTP baseado no tipo de erro.
   * @type {number}
   */
  const statusCode = err instanceof BaseError && err.statusCode ? err.statusCode : 500;

  /**
   * Determina a mensagem de erro padrão ou personalizada.
   * @type {string}
   */
  const message = err instanceof BaseError && err.message ? err.message : 'Internal Server Error';

  /**
   * Determina os detalhes adicionais do erro, se disponíveis.
   * @type {Array<Object>|undefined}
   */
  const details = err instanceof BaseError && err.details.length ? err.details : undefined;

  if (config.nodeEnv !== 'production') {
    console.error(err);
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      ...(details && { details }),
      stack: err.stack,
    });
  } else {
    console.error(err.message);
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      ...(details && { details }),
    });
  }
};
