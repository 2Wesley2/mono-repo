import { SignJWT, jwtVerify } from 'jose';
import debug from '../debug/index.js';
import { tokenService } from '../services/auth/authentication/token/src/index.js';
class AuthMiddleware {
  async generateToken(user) {
    const payload = { id: user._id, role: user.role };
    const token = await tokenService.generateToken(payload);
    return token;
  }

  static async verifyToken(token) {
    try {
      const verifyToken = await tokenService.verifyToken(token);
      return verifyToken;
    } catch (error) {
      debug.logger.error(`AuthMiddleware.js: Erro na verificação do token - ${error.message}`);
      throw new Error('Token inválido');
    }
  }

  static async authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Autenticação necessária' });

    try {
      const decoded = await this.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  static async blockIfAuthenticated(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      debug.logger.info('blockIfAuthenticated: Nenhum token encontrado. Permitir login.');
      return next();
    }

    try {
      const decoded = await this.verifyToken(token);

      if (decoded) {
        debug.logger.info('blockIfAuthenticated: Token válido encontrado. Bloqueando login.');
        return res.status(403).json({ message: 'Você já está autenticado' });
      }
    } catch (error) {
      debug.logger.warn(`blockIfAuthenticated: Token inválido ou expirado. Erro: ${error.message}`);
      return next();
    }
  }

  static logout(req, res) {
    res.clearCookie('token');
    debug.logger.info('AuthMiddleware.js: Token removido. Logout realizado com sucesso.');
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  }
}

export default AuthMiddleware;
