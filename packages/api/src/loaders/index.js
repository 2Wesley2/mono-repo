import mongoose from './mongoose.js';
import cashRegister from './cashRegister.js';
import stock from './stock.js';
import backStock from './backStock.js';
import showRoom from './showRoom.js';

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
  cashRegister,
  stock,
  backStock,
  showRoom,
};
