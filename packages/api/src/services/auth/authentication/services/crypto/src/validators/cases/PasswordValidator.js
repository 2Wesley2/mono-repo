import bcrypt from 'bcryptjs';
import { DefaultValidator } from '../default/index.js';

export default class PasswordValidator extends DefaultValidator {
  async validate(passwordProvided, passwordHashed) {
    super.validate(passwordProvided);
    console.log('chegou aqui 1');
    const isMatch = await bcrypt.compare(passwordProvided, passwordHashed);
    return isMatch;
  }
}
