import TokenService from './interface/index.js';
import JoseTokenService from './modules/JoseTokenService.js';
import JsonWebTokenService from './modules/JsonWebTokenService.js';
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
const tokenServiceArguments = { joseTokenService: joseTokenService, jsonWebTokenService: jsonWebTokenService };
const tokenService = new TokenService({ ...tokenServiceArguments });

export { tokenService };
