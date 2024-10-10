import Database from '../database/index.js';
import AppError from '../errors/AppError.js';

/**
 * Valida se um ID é um ObjectId válido do Mongoose.
 * @param {string} id - O ID a ser validado.
 * @throws {AppError} - Lança um erro se o ID for inválido.
 */
export function validateObjectId(id) {
  if (!Database.isValidObjectId(id)) {
    throw new AppError(400, 'ID inválido.');
  }
}
