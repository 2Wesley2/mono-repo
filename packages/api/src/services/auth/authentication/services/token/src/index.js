import JoseTokenService from './services/JoseTokenService.js';
import JsonWebTokenService from './services/JsonWebTokenService.js';
import { JoseSecretKeyFormatter, JsonWebTokenSecretKeyFormatter } from './formatters/index.js';
import { Base64SecretKeyValidator, UserPayloadValidator } from './validators/cases/index.js';

const userPayloadValidator = new UserPayloadValidator();
const base64SecretKeyValidator = new Base64SecretKeyValidator();
const jsonWebTokenSecretKeyFormatter = new JsonWebTokenSecretKeyFormatter(base64SecretKeyValidator);
const joseSecretKeyFormatter = new JoseSecretKeyFormatter(base64SecretKeyValidator);
const jwtTest = 'l0VjkdHUTxwSvBn1JZre4REvWf/JZ9TTmBDZZTQrxC0=';
const commonArguments = { secretKey: jwtTest, userPayloadValidator };
const joseArguments = {
  joseSecretKeyFormatter,
  ...commonArguments,
};
const jsonwebtokenArguments = {
  jsonWebTokenSecretKeyFormatter,
  ...commonArguments,
};
const joseTokenService = new JoseTokenService({ ...joseArguments });
const jsonWebTokenService = new JsonWebTokenService({ ...jsonwebtokenArguments });

const tokenServices = { joseTokenService, jsonWebTokenService };

export { tokenServices };
