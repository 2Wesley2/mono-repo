import { isString } from '../../../../helpers/stringHelper.js';
class SecretKeyValidator {
  static validate(token) {
    const isValid = isString(token);
    if (!isValid) {
      throw new Error(`O tipo esperado é um estring \n tipo fornecido foi: ${typeof token}`);
    }
    return isValid;
  }
}
export default {
  validate: (...args) => SecretKeyValidator.validate(...args),
};
