import { Schema, model } from "mongoose";
import type { Model } from "mongoose";
import type { MiddlewareConfig } from "#mongoose-wrapper/common/mongoose-types";

/**
 * Obtém os métodos reservados do Model do Mongoose.
 * @returns Um conjunto contendo os nomes dos métodos reservados.
 * @note O uso de Model<any> aqui é intencional, pois a função é utilitária e não depende de tipos específicos.
 */
export const getMongooseReservedMethods = (): Set<string> => {
  const baseModel = {} as Model<any>;
  return new Set(Object.getOwnPropertyNames(baseModel));
};

/**
 * Helper para verificar se o schema precisa ser clonado antes de aplicar middlewares.
 * @param middlewares - Lista de middlewares a serem aplicados.
 * @returns Verdadeiro se o schema precisar ser clonado, falso caso contrário.
 * @example
 * const middlewares = [{ method: "pre", hookEvent: "createCollection", fn: () => {} }];
 * const shouldClone = shouldCloneSchema(middlewares); // true
 */
export const shouldCloneSchema = (
  middlewares: MiddlewareConfig[] = [],
): boolean => {
  return middlewares.length > 0;
};

/**
 * Abstração para o Schema do Mongoose.
 */
export const MongooseSchema = Schema;
/**
 * Abstração para o Model do Mongoose.
 */
export const mongooseModel = model;

/**
 * Verifica se uma expressão regular é válida.
 * @param regex - A expressão regular a ser validada.
 * @returns Verdadeiro se a expressão for válida, falso caso contrário.
 * @example
 * const isValid = isValidRegExp(/abc/); // true
 * const isInvalid = isValidRegExp(/(abc/); // false
 */
export const isValidRegExp = (regex: RegExp): boolean => {
  try {
    new RegExp(regex.source);
    return true;
  } catch {
    return false;
  }
};

/**
 * Verifica se um schema contém campos obrigatórios.
 * @param schemaDefinition - Definição do schema.
 * @returns Verdadeiro se houver campos obrigatórios, falso caso contrário.
 */
export const hasRequiredFields = (
  schemaDefinition: Record<string, any>,
): boolean => {
  return Object.values(schemaDefinition).some(
    (field) => field.required === true,
  );
};
