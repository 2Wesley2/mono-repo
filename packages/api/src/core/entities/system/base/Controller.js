import { Router } from 'express';
import auth from '../../../middlewares/index.js';
/**
 * Classe que representa um controlador genérico com funcionalidade de roteamento.
 */
class Controller {
  /**
   * Inicializa uma nova instância da classe Controller.
   * Configura uma nova instância do roteador do Express.
   */
  constructor() {
    /**
     * A instância do roteador do Express usada para gerenciar rotas.
     * @type {Router}
     */
    this.router = Router();
  }

  /**
   * Recupera a instância do roteador associada ao controlador.
   * @returns {Router} A instância do roteador do Express.
   * @example
   * const controller = new Controller();
   * app.use('/api', controller.getRouter());
   */
  getRouter() {
    return this.router;
  }

  get middlewares() {
    return auth.authMiddleware;
  }
}

export default Controller;
