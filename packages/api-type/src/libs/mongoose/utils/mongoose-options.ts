import type { options } from "#mongoose-wrapper/mongoose-types";
import type { SchemaTimestampsConfig } from "mongoose";

/**
 * Configura as opções padrão para um schema.
 * @param options - Opções fornecidas pelo usuário.
 * @returns Opções configuradas com valores padrão.
 * @throws Lança um erro se `timestamps` já estiver definido.
 */
export const configureOptions = (options: options = {}): options => {
  const defaultOptions: options = { timestamps: true };

  if (options.timestamps && typeof options.timestamps === "object") {
    defaultOptions.timestamps = {
      ...(defaultOptions.timestamps as SchemaTimestampsConfig),
      ...(options.timestamps as SchemaTimestampsConfig),
    };
  } else if (typeof options.timestamps === "boolean") {
    defaultOptions.timestamps = options.timestamps;
  }

  return { ...defaultOptions, ...options };
};
