import mongoose from './mongoose.js';
/**
 * Exporta um objeto centralizado contendo o módulo `mongoose`.
 *
 * @description
 * Este objeto fornece uma interface simplificada para utilizar as funcionalidades
 * do Mongoose em todo o projeto.
 *
 * @example
 * import loaders from '../../loaders/index.js';
 * const { mongoose } = loaders;
 * const { registerModel } = mongoose;
 * const T = loaders.mongoose.Metodo
 */
export default {
  mongoose,
};
