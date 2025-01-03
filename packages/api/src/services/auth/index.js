import { authentication } from './authentication/index.js';
import { authorization } from './authorization/index.js';

const auth = { authentication: authentication, authorization: authorization };
export default { ...auth };
