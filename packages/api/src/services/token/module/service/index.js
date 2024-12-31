import { Base64SecretKeyValidator, UserPayloadValidator } from '../../module/validators/cases/index.js';
import { JoseSecretKeyFormatter } from '../formatters/index.js';

const userPayloadValidator = new UserPayloadValidator();
const base64SecretKeyValidator = new Base64SecretKeyValidator();
const joseSecretKeyFormatter = new JoseSecretKeyFormatter(base64SecretKeyValidator);
export { joseSecretKeyFormatter, userPayloadValidator };
