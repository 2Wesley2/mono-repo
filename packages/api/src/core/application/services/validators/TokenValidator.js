import { isString } from '../../../../helpers/stringHelper.js';
class TokenValidator {
  static validate(token) {
    const isValid = isString(token);
    if (!isValid) {
      throw new Error(`O tipo esperad é um estring \n tipo fornecido foi: ${typeof token}`);
    }
    return isValid;
  }
}
export default {
  validate: (...args) => TokenValidator.validate(...args)
};
