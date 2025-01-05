import { BcryptjsService } from './services/index.js';
import { PasswordValidator } from './validators/cases/index.js';
import { PasswordFormatter } from './formatters/index.js';

const passwordValidator = new PasswordValidator();
const passwordFormatter = new PasswordFormatter();
const bcryptjsService = new BcryptjsService({
  passwordValidator: passwordValidator,
  passwordFormatter: passwordFormatter,
});

const cryptoServices = { bcryptjsService };

export { cryptoServices };
