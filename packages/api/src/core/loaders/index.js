import mongoose from '../adapters/database/mongoose/index.js';
import auth from '../adapters/auth/index.js';

/**
 * Módulo de carregadores (loaders) da aplicação, centralizando a importação de adaptadores e outros componentes.
 *
 * @module loaders
 * @property {Object} mongoose - Adaptador para conexão e manipulação do banco de dados via Mongoose.
 * @property {Object} auth - Adaptador para autenticação.
 *
 * @example
 * import loaders from './core/loaders/index.js';
 * loaders.mongoose.init('meuBanco');
 */

export default {
  mongoose,
  auth,
};
