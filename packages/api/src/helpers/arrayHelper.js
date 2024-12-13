/**
 * Converte um valor em um array. Caso o valor seja nulo ou indefinido, retorna um array vazio.
 * Se o valor já for um array, retorna o próprio valor.
 * Caso contrário, retorna o valor encapsulado em um array.
 *
 * @param {*} value - O valor a ser convertido em um array.
 * @returns {Array} Um array contendo o valor fornecido ou vazio se o valor for nulo/indefinido.
 * @example
 * toArray(null); // Retorna []
 * toArray(5); // Retorna [5]
 * toArray([1, 2, 3]); // Retorna [1, 2, 3]
 * toArray('string'); // Retorna [ 'string' ]
 * toArray({}); // Retorna [ {} ]
 *
 * Exemplo com função como propriedade:
 * const sum = (a, b) => a + b;
 * const functionAsProperty = toArray(sum);
 * console.log(functionAsProperty); // Retorna: [ [Function: sum] ]
 *
 * Exemplo com chamada de função:
 * const resultOfFunction = toArray(sum(3, 3));
 * console.log(resultOfFunction); // Retorna: [ 6 ]
 */
export const toArray = (value) => {
  if (value == null) return []; // Retorna array vazio se o valor for nulo ou indefinido
  return Array.isArray(value) ? value : [value]; // Retorna o valor como array
};
