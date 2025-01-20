import auth from '../adapters/auth/index.js';
class AuthenticationMiddleware {
  static async blockIfAuthenticated(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return next();
    }
    try {
      const verify = await auth.authentication.isAuthenticate(token);
      if (verify) {
        return res.status(403).json({ message: 'Você já está autenticado' });
      }
    } catch (error) {
      return next(error);
    }
  }
}
export default { blockIfAuthenticated: (...args) => AuthenticationMiddleware.blockIfAuthenticated(...args) };
