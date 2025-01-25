import { isString } from '#src/helpers/stringHelper.js';

class User {
  static validateRequiredFields(fields) {
    if (typeof fields !== 'object' || fields == null) {
      throw new TypeError('Experado um objeto não vazio para fields');
    }
    const values = Object.values(fields);
    return isString(values);
  }
}
export default {
  validateRequiredFields: (...args) => User.validateRequiredFields(...args),
};
