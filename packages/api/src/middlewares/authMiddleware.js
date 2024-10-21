import jwt from 'jsonwebtoken';
import config from '../config/index.js';

class AuthMiddleware {
  constructor() {
    this.secretKey = config.jwtSecret;
  }

  generateToken(user) {
    const payload = { id: user._id, role: user.role };
    return jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Autenticação necessária' });

    try {
      const decoded = this.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  blockIfAuthenticated(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        this.verifyToken(token);
        return res.status(400).json({ message: 'Você já está logado' }); // Block the login attempt
      } catch (error) {
        next();
      }
    } else {
      next();
    }
  }
}

export default new AuthMiddleware();
