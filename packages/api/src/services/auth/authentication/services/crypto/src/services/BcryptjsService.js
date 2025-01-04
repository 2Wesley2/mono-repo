export default class BcryptjsService {
  constructor({ passwordValidator, passwordFormatter }) {
    this.passwordValidator = passwordValidator;
    this.passwordFormatter = passwordFormatter;
  }

  async hash(password) {
    const hashedPassword = await passwordFormatter.format(password);
    return hashedPassword;
  }
  async validatePassword(passwordProvided, passwordHashed) {
    console.log('chegou aqui 2');
    const isMatch = await passwordValidator.validate(passwordProvided, passwordHashed);
    return isMatch;
  }
}
