import mongooseErrors from "#errors-mongoose";
import type { IMongooseErrorHandler } from "#contract-mongoose";

/**
 * Helper para lançar erros de validação.
 * Centraliza a lógica de construção e lançamento de erros.
 *
 * Exemplo de uso:
 * ```typescript
 * throwValidationError(
 *   mongooseErrors.GenericMongooseError,
 *   "UserContext",
 *   [{ field: "email", issue: "invalid format" }],
 *   "Erro de validação no campo email."
 * );
 * ```
 *
 * @param errorClass - Classe de erro a ser lançada.
 * @param context - Contexto associado ao erro.
 * @param details - Detalhes adicionais do erro.
 * @param message - Mensagem de erro.
 */
export const throwValidationError = (
  errorClass: typeof mongooseErrors.GenericMongooseError,
  context: string,
  details: Array<object>,
  message: string,
): never => {
  throw new errorClass(context, details, message);
};

/**
 * Wrapper para centralizar o tratamento de erros.
 * Este método encapsula a execução de uma função e delega o tratamento de erros
 * ao serviço de tratamento de erros injetado.
 *
 * @param fn - Função a ser executada.
 * @param errorHandler - Serviço de tratamento de erros.
 * @param collection - Nome da coleção associada ao erro.
 * @returns O resultado da função, se bem-sucedida.
 * @throws Lança um erro tratado pelo errorHandler.
 */
export const withErrorHandling = <T>(
  fn: () => T,
  errorHandler: IMongooseErrorHandler,
  collection: string,
): T => {
  try {
    return fn();
  } catch (error: unknown) {
    errorHandler.handle(error, collection);
  }
};

/**
 * Wrapper centralizado para aplicar o withErrorHandling.
 * @param fn - Função a ser executada.
 * @param errorHandler - Serviço de tratamento de erros.
 * @param context - Contexto associado ao erro.
 * @returns O resultado da função, se bem-sucedida.
 */
export const handleWithErrorHandling = <T>(
  fn: () => T,
  errorHandler: IMongooseErrorHandler,
  context: string,
): T => {
  return withErrorHandling(fn, errorHandler, context);
};
