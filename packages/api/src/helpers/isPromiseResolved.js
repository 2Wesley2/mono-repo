import { InvalidRequestError, GenericError } from '../errors/Exceptions.js';

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
 * @throws {InvalidRequestError} Lança erro caso o valor passado não seja uma promise válida.
 * @throws {GenericError} Lança erro caso a promise seja rejeitada.
 */
const isPromiseResolved = async (promise) => {
  if (!isPromise) {
    throw new InvalidRequestError([{ field: 'promise', message: 'O valor fornecido não é uma Promise válida.' }]);
  }
  try {
    return await promise;
  } catch {
    throw new GenericError([{ field: 'promise', message: 'Promessa rejeitada.' }]);
  }
};

export default isPromiseResolved;
