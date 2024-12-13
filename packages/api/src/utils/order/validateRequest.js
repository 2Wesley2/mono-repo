import AppError from '../../errors/AppError.js';

/**
 * Código de status HTTP para requisições inválidas.
 * @constant {number}
 */
const badRequestNumberStatus = 400;

/**
 * Um mapa que associa tipos de validação a suas respectivas funções de validação.
 *
 * Cada função de validação deve:
 * - Aceitar um parâmetro de entrada.
 * - Lançar um erro se a validação falhar.
 * - Retornar o valor validado se a validação for bem-sucedida.
 *
 */
const validators = new Map([
  [
    /**
     * Valida se o número da comanda é um número inteiro válido.
     * @param {*} input - O valor a ser validado como número da comanda.
     * @returns {number} O número da comanda validado.
     * @throws {AppError} Se o número da comanda for inválido.
     * @example
     * const orderNumber = validators.get('orderNumber')('123');
     * console.log(orderNumber); // 123
     */
    'orderNumber',
    (input) => {
      const orderNumber = parseInt(input, 10);
      if (isNaN(orderNumber)) {
        throw new AppError(badRequestNumberStatus, 'Número da comanda inválido. Deve ser um número.');
      }
      return orderNumber;
    },
  ],
  [
    'products',
    /**
     * Valida um array de produtos, verificando seus campos obrigatórios.
     * Cada produto deve conter:
     * - Uma string válida para o campo `product`.
     * - Um número válido para o campo `quantity`.
     *
     * @param {*} input - O valor a ser validado como array de produtos.
     * @returns {boolean} Retorna `true` se a validação for bem-sucedida.
     * @throws {AppError} Se o array de produtos ou seus itens forem inválidos.
     * @example
     * const isValid = validators.get('products')([
     *   { product: 'Produto A', quantity: 2 },
     *   { product: 'Produto B', quantity: 5 },
     * ]);
     * console.log(isValid); // true
     */
    (input) => {
      if (!input || !Array.isArray(input) || input.length === 0) {
        throw new AppError(badRequestNumberStatus, 'O array de produtos é obrigatório e não pode estar vazio.');
      }
      input.forEach(({ product, quantity, ...rest }) => {
        if (!product || typeof product !== 'string') {
          throw new AppError(
            badRequestNumberStatus,
            'Cada item no array de produtos deve conter uma string válida para o produto.',
          );
        }
        if (typeof quantity !== 'number') {
          throw new AppError(
            badRequestNumberStatus,
            'Cada item no array de produtos deve conter um número válido para a quantidade.',
          );
        }
        if (Object.keys(rest).length > 0) {
          throw new AppError(badRequestNumberStatus, `Campos inesperados no item de produtos: ${JSON.stringify(rest)}`);
        }
      });
      return true;
    },
  ],
]);

/**
 * Valida uma requisição com base no tipo.
 *
 * @param {string} type - Tipo de validação (chave no mapa de validações).
 * @param {*} input - Dados de entrada a serem validados.
 * @returns {*} O valor validado ou resultado da validação.
 * @throws {Error} Se o tipo de validação for desconhecido.
 * @throws {AppError} Se a validação falhar.
 * @example
 * Validação de um número de comanda:
 * const orderNumber = validateRequest('orderNumber', '123');
 * console.log(orderNumber); // 123
 *
 * Validação de produtos:
 * const isValid = validateRequest('products', [
 *   { product: 'Produto A', quantity: 2 },
 *   { product: 'Produto B', quantity: 5 },
 * ]);
 * console.log(isValid); // true
 */
function validateRequest(type, input) {
  const validator = validators.get(type);
  if (!validator) {
    throw new Error(`Tipo de validação desconhecido: ${type}`);
  }
  return validator(input);
}
export default validateRequest;
