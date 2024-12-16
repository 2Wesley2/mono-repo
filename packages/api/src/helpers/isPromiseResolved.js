import AppError from '../errors/AppError.js';

/**
 * Verifica se o valor é uma Promise válida.
 * @param {*} value - O valor a ser verificado.
 * @returns {boolean} Retorna `true` se for uma Promise, caso contrário `false`.
 */
const isPromise = (value) => {
  return value instanceof Promise;
};

/**
 * Função para verificar se uma promise foi resolvida com sucesso.
 * @param {Promise} promise - A promise a ser verificada.
 * @returns {Promise<boolean>} Retorna `true` se a promise for resolvida com sucesso, caso contrário `false`.
 * @throws {AppError} Lança erro caso o valor passado não seja uma promise válida.
 */
const isPromiseResolved = async (promise) => {
  if (!isPromise) {
    throw new AppError(400, 'O valor fornecido não é uma Promise');
  }
  try {
    return await promise;
  } catch {
    throw new AppError(500, 'Promessa rejeitada');
  }
};

export default isPromiseResolved;
