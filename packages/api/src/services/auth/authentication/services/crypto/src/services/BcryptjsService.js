export default class BcryptjsService {
  constructor({ passawordValidator, passwordFormatter }) {
    this.passawordValidator = passawordValidator;
    this.passwordFormatter = passwordFormatter;
  }

  async hash(password) {
    const hashedPassword = await passwordFormatter.format(password);
    return hashedPassword;
  }
  async validatePassword(passwordProvided, passwordHashed) {
    const isMatch = await passawordValidator.validate(passwordProvided, passwordHashed);
    return isMatch;
  }
}
