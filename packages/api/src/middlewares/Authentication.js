import AuthenticationMiddleware from './AuthenticationMiddleware.js';
import TokenService from '../services/auth/rbac/authentication/token/src/modules/JoseTokenService.js';

const tokenService = new TokenService();
const authenticationMiddleware = new AuthenticationMiddleware(tokenService);

export { authenticationMiddleware };
