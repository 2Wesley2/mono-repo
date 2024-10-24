import { Router } from 'express';
class Controller {
  constructor() {
    this.router = Router();
  }

  getRouter() {
    return this.router;
  }
}

export default Controller;
