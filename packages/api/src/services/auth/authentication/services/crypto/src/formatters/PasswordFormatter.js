import bcrypt from 'bcryptjs';
import { Formatter } from '../../../../../contracts/index.js';

export default class PasswordFormatter extends Formatter {
  async format(password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }
}
