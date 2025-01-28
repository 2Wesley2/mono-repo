class User {
  static validateRequiredFields(fields) {
    if (typeof fields !== 'object' || fields == null) {
      throw new TypeError('Experado um objeto não vazio para fields');
    }
    const values = Object.values(fields);
    return values;
  }
}
export default {
  validateRequiredFields: (...args) => User.validateRequiredFields(...args),
};
