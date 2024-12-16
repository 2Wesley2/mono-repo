import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { PRODUCT } from '../../constants/index.js';

/**
 * Esquema do modelo de produto.
 *
 * @typedef {Object} ProductSchema
 * @property {string} name - Nome do produto (obrigatório).
 * @property {number} price - Preço do produto (obrigatório).
 * @property {string} type - Tipo do produto, pode ser "ready_to_sell" ou "made_in_house" (obrigatório).
 * @property {number} [quantity] - Quantidade em estoque (obrigatória para produtos "ready_to_sell").
 * @property {string} [category] - Categoria do produto.
 * @property {string} barcode - Código de barras único do produto (obrigatório).
 */
const productSchema = {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['ready_to_sell', 'made_in_house'], required: true },
  quantity: {
    type: Number,
    required: function () {
      return this.type === 'ready_to_sell';
    },
    validate: {
      validator: function (v) {
        return this.type === 'made_in_house' || v >= 0;
      },
      message: 'Quantity cannot be negative for "ready_to_sell" products',
    },
  },
  category: { type: String, required: false },
  barcode: { type: String, unique: true, required: true },
};

/**
 * Classe para interação com o modelo de Produto no banco de dados.
 * Extende a classe base Model para herdar funcionalidades comuns.
 *
 * @class ProductModel
 */
class ProductModel extends Model {
  /**
   * Cria uma instância de ProductModel.
   */
  constructor() {
    super(productSchema, PRODUCT);
  }

  /**
   * Cria um novo produto no banco de dados.
   *
   * @param {ProductSchema} data - Dados do produto a ser criado.
   * @returns {Promise<Object>} O produto criado.
   * @throws {Error} Lança um erro se ocorrer algum problema durante a criação.
   * @example
   * const newProduct = await productModel.createProduct({ name: 'Produto A', price: 10.99, type: 'ready_to_sell', barcode: '123456789' });
   */
  async createProduct(data) {
    return await this.model.create(data);
  }

  /**
   * Cria vários produtos em lote no banco de dados.
   *
   * @param {ProductSchema[]} productList - Lista de produtos a serem criados.
   * @returns {Promise<Object[]>} Os produtos criados.
   * @throws {Error} Lança um erro se ocorrer algum problema durante a criação.
   * @example
   * const products = await productModel.bulkCreate([{ name: 'Produto A', price: 10.99, type: 'ready_to_sell', barcode: '123456789' }]);
   */
  async bulkCreate(productList) {
    return await this.model.insertMany(productList);
  }

  /**
   * Busca produtos por categoria no banco de dados.
   *
   * @param {string} category - Categoria dos produtos.
   * @returns {Promise<Object[]>} Lista de produtos encontrados.
   * @example
   * const products = await productModel.findByCategory('Bebidas');
   */
  async findByCategory(category) {
    return await this.model.find({ category });
  }

  /**
   * Busca produtos por IDs no banco de dados.
   *
   * @param {string[]} ids - Lista de IDs dos produtos.
   * @returns {Promise<Object[]>} Lista de produtos encontrados.
   * @example
   * const products = await productModel.getProductsByIds(['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86']);
   */
  async getProductsByIds(ids) {
    return await this.model.find({ _id: { $in: ids } });
  }

  /**
   * Realiza uma busca por produtos no banco de dados com base no nome.
   *
   * @param {string} q - Consulta de busca.
   * @returns {Promise<Object[]>} Lista de produtos que correspondem à busca.
   * @example
   * const products = await productModel.searchProducts('Coca');
   */
  async searchProducts(q) {
    return await this.model.find({ name: { $regex: `^${q}`, $options: 'i' } });
  }

  /**
   * Atualiza um produto no banco de dados.
   *
   * @param {string} id - ID do produto a ser atualizado.
   * @param {Object} data - Dados a serem atualizados no produto.
   * @returns {Promise<Object|null>} O produto atualizado ou null se não encontrado.
   * @throws {Error} Lança um erro se ocorrer algum problema durante a atualização.
   * @example
   * const updatedProduct = await productModel.updateProduct('60d21b4667d0d8992e610c85', { price: 12.99 });
   */
  async updateProduct(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Deleta um produto do banco de dados.
   *
   * @param {string} id - ID do produto a ser deletado.
   * @returns {Promise<boolean>} True se o produto foi deletado com sucesso.
   * @throws {Error} Lança um erro se ocorrer algum problema durante a exclusão.
   * @example
   * const success = await productModel.deleteProduct('60d21b4667d0d8992e610c85');
   */
  async deleteProduct(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default ProductModel;
