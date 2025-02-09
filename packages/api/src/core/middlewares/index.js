import authMiddleware from './AuthenticationMiddleware.js';
import errorHandler from './errorHandler.js';
export default {
  authMiddleware,
  errorHandler: (...args) => errorHandler(...args)
};
