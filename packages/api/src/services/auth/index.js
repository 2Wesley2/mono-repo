import { authentication } from './authentication/index.js';
import { authorization } from './authorization/index.js';

const authServices = { authentication: authentication, authorization: authorization };

export default class Auth {
  get authorizationService() {
    return authServices.authorization;
  }

  get authenticationService() {
    return authServices.authentication;
  }
}
