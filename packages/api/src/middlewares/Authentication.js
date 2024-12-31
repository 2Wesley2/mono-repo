import AuthenticationMiddleware from './AuthenticationMiddleware.js';
import TokenService from '../services/token/module/interface/TokenService.js';

const tokenService = new TokenService();
const authenticationMiddleware = new AuthenticationMiddleware(tokenService);

export { authenticationMiddleware };
