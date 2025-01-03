import AuthenticationMiddleware from './AuthenticationMiddleware.js';
import TokenService from '../services/auth/authentication/token/src/services/JoseTokenService.js';

const tokenService = new TokenService();
const authenticationMiddleware = new AuthenticationMiddleware(tokenService);

export { authenticationMiddleware };
