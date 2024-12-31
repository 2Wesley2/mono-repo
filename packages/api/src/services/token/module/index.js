import TokenService from './interface/TokenService.js';
import { joseSecretKeyFormatter, userPayloadValidator } from '../module/service/index.js';
import config from '../../../config/index.js';

const tokenServiceArguments = {
  joseSecretKeyFormatter,
  secretKey: config.jwtSecret,
  userPayloadValidator,
};

const tokenService = new TokenService({ ...tokenServiceArguments });
export { tokenService };
