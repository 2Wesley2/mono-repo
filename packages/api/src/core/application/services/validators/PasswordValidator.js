import { isString } from '../../../../helpers/stringHelper.js';
class PasswordValidator {
  static validateDataType(password) {
    const isValid = isString(password);
    if (!isValid) {
      throw new Error(`O tipo esperado é uma string \n tipo fornecido foi: ${typeof password}`);
    }
    return isValid;
  }
}
export default {
  validateDataType: (...args) => PasswordValidator.validateDataType(...args)
};
