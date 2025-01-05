export default class BcryptjsService {
  constructor({ passwordValidator, passwordFormatter }) {
    this.passwordValidator = passwordValidator;
    this.passwordFormatter = passwordFormatter;
  }

  async hash(password) {
    const hashedPassword = await this.passwordFormatter.format(password);
    return hashedPassword;
  }
  async validatePassword(passwordProvided, passwordHashed) {
    const isMatch = await this.passwordValidator.validate(passwordProvided, passwordHashed);
    return isMatch;
  }
}
