import Controller from '#src/core/infrastructure/components/base/Controller.js';
import { UnauthorizedError } from '#src/errors/Exceptions.js';

export default class OwnerUserController extends Controller {
  constructor(service) {
    super();
    this.initializeCustomRoutes();
    this.service = service;
  }

  initializeCustomRoutes() {
    this.router.get('validate-session', this.validateSession.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.post('/logout', this.logout.bind(this));
    this.router.post('/signup', this.signUp.bind(this));
  }

  validateSession(req, res, next) {
    try {
      const { token } = req.cookies;
      const isValidSesseion = this.service.validateSession(token);
      if (!isValidSesseion) {
        throw new UnauthorizedError();
      }
      res.status(200).json(isValidSesseion);
    } catch (error) {
      next(error);
    }
  }

  async signUp(req, res, next) {
    const {
      cpf,
      firstName,
      lastName,
      birthDate,
      street,
      neighborhood,
      houseNumber,
      postalCode,
      city,
      state,
      email,
      password,
      cnpj,
      legalName,
      tradeName
    } = req.body;
    try {
      const userData = {
        cpf,
        firstName,
        lastName,
        birthDate,
        street,
        neighborhood,
        houseNumber,
        postalCode,
        city,
        state,
        email,
        password,
        cnpj,
        legalName,
        tradeName
      };
      const createdUser = await this.service.signUp({ ...userData });
      return res.status(200).json(createdUser);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { password, email } = req.body;
      const credentials = { email, password };
      const token = await this.service.login({ ...credentials });
      if (!token) {
        throw new UnauthorizedError();
      }
      res.cookie('wfSystem', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3600000
      });
      res.status(200).json('logou');
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  }
}
