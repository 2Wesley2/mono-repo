import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import debug from '../debug/index.js';

class AuthMiddleware {
  static secretKey = config.jwtSecret;

  static generateToken(user) {
    const payload = { id: user._id, role: user.role };
    return jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  static authenticate(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Autenticação necessária' });

    try {
      const decoded = this.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  static blockIfAuthenticated(req, res, next) {
    const token = req.cookies.token;

    // Verifica se o token está presente nos cookies
    if (!token) {
      debug.logger.info('blockIfAuthenticated: Nenhum token encontrado. Permitir login.');
      return next(); // Permite login se não houver token
    }

    try {
      // Verifica se o token é válido
      const decoded = this.verifyToken(token);

      // Se o token for válido, bloqueia a requisição de login
      if (decoded) {
        debug.logger.info('blockIfAuthenticated: Token válido encontrado. Bloqueando login.');
        return res.status(403).json({ message: 'Você já está autenticado' });
      }
    } catch (error) {
      // Se o token for inválido ou expirado, permite que o fluxo continue
      debug.logger.warn(`blockIfAuthenticated: Token inválido ou expirado. Erro: ${error.message}`);
      return next();
    }
  }

  static logout(req, res) {
    res.clearCookie('token');
  }
}

export default AuthMiddleware;
