import Controller from '../../../../core/infrastructure/components/base/Controller.js';
import debug from '../../../../debug/index.js';
//import AuthMiddleware from '../../../middlewares/authMiddleware.js';
//import AuthorizationMiddleware from '../../../middlewares/authorizationMiddleware.js';

/**
 * Classe responsável por gerenciar as rotas e operações relacionadas a clientes.
 * Extende a classe base Controller para herdar funcionalidades comuns.
 *
 * @class CustomerController
 */
class CustomerController extends Controller {
  /**
   * Cria uma instância de CustomerController.
   *
   * @param {Object} service - Instância do serviço que contém a lógica de negócios para clientes.
   */
  constructor(service) {
    super();
    this.service = service;
    this.initializeCustomRoutes();
  }

  /**
   * Inicializa as rotas personalizadas do controlador de clientes.
   */
  initializeCustomRoutes() {
    /**
     * @route POST /register
     * Rota para registrar um novo cliente.
     */
    this.router.post('/register', this.createCustomer.bind(this));

    /**
     * @route GET /all
     * Rota para listar todos os clientes.
     */
    this.router.get('/all', this.listAllCustomers.bind(this));

    /**
     * @route PUT /:id
     * Rota para atualizar um cliente pelo ID.
     */
    this.router.put('/:id', this.updateCustomer.bind(this));

    /**
     * @route DELETE /:id
     * Rota para deletar um cliente pelo ID.
     */
    this.router.delete('/:id', this.deleteCustomer.bind(this));
  }

  /**
   * Cria um novo cliente.
   *
   * @param {Object} req - Objeto de requisição HTTP.
   * @param {Object} req.body - Dados do cliente a ser criado.
   * @param {Object} res - Objeto de resposta HTTP.
   * @param {Function} next - Função para passar o controle ao próximo middleware.
   * @returns {Promise<void>} Retorna o cliente criado no formato JSON ou um erro caso ocorra.
   * @example
   * POST /register
   * {
   *   "name": "John Doe",
   *   "cpf": "12345678900",
   *   "phone": "5551999999999"
   * }
   */
  async createCustomer(req, res, next) {
    try {
      const customerData = req.body;
      if (!customerData.name || !customerData.cpf || !customerData.phone) {
        return res.status(400).json({
          message: 'Nome, CPF e Celular são obrigatórios para criar o cliente'
        });
      }

      const newCustomer = await this.service.createCustomer(customerData);
      debug.logger.info('Controlador: Cliente criado com sucesso', {
        customerData
      });
      res.status(201).json(newCustomer);
    } catch (error) {
      debug.logger.error('Controlador: Erro ao criar cliente', { error });
      next(error);
    }
  }

  /**
   * Atualiza um cliente pelo ID.
   *
   * @param {Object} req - Objeto de requisição HTTP.
   * @param {Object} req.params - Parâmetros da requisição.
   * @param {string} req.params.id - ID do cliente a ser atualizado.
   * @param {Object} req.body - Dados de atualização do cliente.
   * @param {Object} res - Objeto de resposta HTTP.
   * @param {Function} next - Função para passar o controle ao próximo middleware.
   * @returns {Promise<void>} Retorna o cliente atualizado no formato JSON ou um erro caso ocorra.
   * @example
   * PUT /:id
   * {
   *   "name": "Jane Doe"
   * }
   */
  async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id || !updateData) {
        return res.status(400).json({ message: 'ID e dados de atualização são obrigatórios' });
      }
      const updatedCustomer = await this.service.updateCustomer(id, updateData);
      debug.logger.info('Controlador: Cliente atualizado', { id, updateData });
      res.status(200).json(updatedCustomer);
    } catch (error) {
      debug.logger.error('Controlador: Erro ao atualizar cliente', {
        id,
        error
      });
      next(error);
    }
  }

  /**
   * Lista todos os clientes.
   *
   * @param {Object} req - Objeto de requisição HTTP.
   * @param {Object} res - Objeto de resposta HTTP.
   * @param {Function} next - Função para passar o controle ao próximo middleware.
   * @returns {Promise<void>} Retorna uma lista de clientes no formato JSON ou um erro caso ocorra.
   * @example
   * GET /all
   */
  async listAllCustomers(req, res, next) {
    try {
      const customers = await this.service.listAllCustomers();
      res.json({ customers: customers });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deleta um cliente pelo ID.
   *
   * @param {Object} req - Objeto de requisição HTTP.
   * @param {Object} req.params - Parâmetros da requisição.
   * @param {string} req.params.id - ID do cliente a ser deletado.
   * @param {Object} res - Objeto de resposta HTTP.
   * @param {Function} next - Função para passar o controle ao próximo middleware.
   * @returns {Promise<void>} Retorna uma mensagem de sucesso ou um erro caso ocorra.
   * @example
   * DELETE /:id
   */
  async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID é obrigatório' });
      }
      await this.service.deleteCustomer(id);
      debug.logger.info('Controlador: Cliente deletado', { id });
      res.status(200).json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      debug.logger.error('Controlador: Erro ao deletar cliente', { id, error });
      next(error);
    }
  }
}

export default CustomerController;
