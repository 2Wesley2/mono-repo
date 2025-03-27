import { Schema, model } from "mongoose";
import type { Model } from "mongoose";
import type { MiddlewareConfig } from "#mongoose-wrapper/mongoose-types";

export const getMongooseReservedMethods = (): Set<string> => {
  const dummyModel = {} as Model<any>;
  return new Set(Object.getOwnPropertyNames(dummyModel));
};

/**
 * Helper para verificar se o schema precisa ser clonado antes de aplicar middlewares.
 * @param middlewares - Lista de middlewares a serem aplicados.
 * @returns Verdadeiro se o schema precisar ser clonado, falso caso contrário.
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
 */
export const isValidRegExp = (regex: RegExp): boolean => {
  try {
    new RegExp(regex.source);
    return true;
  } catch {
    return false;
  }
};
