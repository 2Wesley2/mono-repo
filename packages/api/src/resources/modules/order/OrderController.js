import Controller from '../../../resources/core/Controller.js';
import { validateRequest, mergeDuplicateProducts } from '../../../utils/order/index.js';
import isPromiseResolved from '../../../helpers/isPromiseResolved.js';
/**
 * @class OrderController
 * Controlador para gerenciar operações relacionadas a ordens, incluindo listagem e atualização de produtos em uma ordem.
 * Estende a classe base `Controller` para oferecer suporte a rotas e métodos HTTP.
 */
class OrderController extends Controller {
  /**
   * Cria uma nova instância de `OrderController`.
   * @param {Object} service - Serviço que fornece métodos para manipular dados de ordens.
   */
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  /**
   * Inicializa as rotas personalizadas do controlador.
   * As rotas definidas incluem operações específicas para ordens.
   */
  initializeCustomRoutes() {
    // Define rotas específicas para ordens.
    // Exemplos de rotas que podem ser ativadas:
    // this.router.post('/', this.createOrder.bind(this));
    // this.router.post('/bulk', this.bulkCreate.bind(this));
    this.router.get('/:orderNumber/products', this.listProductsByOrder.bind(this));
    this.router.put('/:orderNumber/order', this.updateOrderProducts.bind(this));
  }

  /**
   * Lista todos os produtos associados a uma ordem específica.
   * @param {Object} req - Objeto de requisição do Express.
   * @param {Object} res - Objeto de resposta do Express.
   * @param {Function} next - Próximo middleware para tratamento de erros.
   * @returns {Promise<void>} Responde com os produtos da ordem em formato JSON.
   * @throws {Error} Retorna status 400 se `orderNumber` não for válido.
   * @example
   * GET /api/orders/123/products
   * Resposta:
   * [
   *   { product: 'Produto A', quantity: 2 },
   *   { product: 'Produto B', quantity: 3 }
   * ]
   */
  async listProductsByOrder(req, res, next) {
    try {
      let { orderNumber } = req.params;
      orderNumber = parseInt(orderNumber, 10);
      if (isNaN(orderNumber)) {
        return res.status(400).json({ success: false, message: 'Parâmetro orderNumber deve ser um número válido.' });
      }
      const products = await isPromiseResolved(this.service.listProductsByOrder(orderNumber));
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza as quantidades de produtos em uma ordem existente.
   * Valida os dados de entrada, verifica duplicados e atualiza os produtos na ordem.
   * @param {Object} req - Objeto de requisição do Express.
   * @param {Object} res - Objeto de resposta do Express.
   * @param {Function} next - Próximo middleware para tratamento de erros.
   * @returns {Promise<void>} Responde com os produtos atualizados.
   * @throws {Error} Lança erro se a validação de entrada falhar ou se a atualização não for bem-sucedida.
   * @example
   * PUT /api/orders/123/order
   * Body:
   * {
   *   "products": [
   *     { "product": "Produto A", "quantity": 2 },
   *     { "product": "Produto B", "quantity": 3 }
   *   ]
   * }
   *  Resposta:
   * {
   *   "products": [
   *     { "product": "Produto A", "quantity": 2 },
   *     { "product": "Produto B", "quantity": 3 }
   *   ]
   * }
   */
  async updateOrderProducts(req, res, next) {
    const { orderNumber } = req.params;
    const { products } = req.body;
    try {
      // Valida entradas usando funções auxiliares
      validateRequest('orderNumber', orderNumber);
      validateRequest('products', products);

      // Remove duplicados e realiza atualização
      const mergedDuplicateProducts = mergeDuplicateProducts(products);
      const updatedProducts = await isPromiseResolved(
        this.service.updateOrderProducts(orderNumber, mergedDuplicateProducts),
      );

      // Responde com os dados atualizados
      res.status(200).json({ updatedProducts });
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
