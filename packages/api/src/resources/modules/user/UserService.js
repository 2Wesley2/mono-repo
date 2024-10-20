import Service from '../../core/Service.js';
import { USER } from '../../constants/index.js';

class UserService extends Service {
  constructor(repository) {
    super(repository, USER);
    this.secretKey = '';
  }

  generateToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, this.secretKey, { expiresIn: '1h' });
  }

  async login(username, password) {
    const user = await UserModel.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Credenciais inválidas');
    }
    const token = this.generateToken(user);
    return { user, token };
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
    if (!token) return res.status(401).json({ error: 'Acesso negado' });

    try {
      const decoded = this.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Token inválido' });
    }
  }

  authorize(roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Acesso proibido' });
      }
      next();
    };
  }
}

export default UserService;
