import Authentication from './interface/index.js';
import { tokenServices } from './services/token/src/index.js';
import { cryptoServices } from './services/crypto/src/index.js';

const tokenService = tokenServices.jsonWebTokenService;
const cryptoService = cryptoServices.bcryptjsService;

export const authentication = new Authentication({ ...tokenService, ...cryptoService });
