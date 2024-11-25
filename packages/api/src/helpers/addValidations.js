import { toArray } from './arrayHelper.js';
/**
 * Adiciona validações personalizadas a um schema do Mongoose.
 *
 * @param {mongoose.Schema} schema - O schema ao qual as validações serão aplicadas.
 * @param {Array<Function>|Function} validations - Lista ou função única de validação.
 */
export const addValidations = (schema, validations) => {
  const validationFunctions = toArray(validations).filter((fn) => typeof fn === 'function');

  validationFunctions.forEach((validation) => {
    schema.pre('save', async function (next) {
      try {
        await validation.call(this);
        next();
      } catch (err) {
        next(err);
      }
    });
  });
};
