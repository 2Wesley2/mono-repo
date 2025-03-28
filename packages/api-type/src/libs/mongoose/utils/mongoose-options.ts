import type { SchemaTimestampsConfig } from "mongoose";
import type {
  Options,
  ConfigureOptionsType,
} from "#mongoose-wrapper/common/mongoose-types";

/**
 * Normaliza o valor de `timestamps` para garantir que seja sempre `true` ou um objeto válido.
 * @param timestamps - Valor fornecido pelo usuário.
 * @returns Valor normalizado de `timestamps`.
 */
const normalizeTimestamps = (
  timestamps: boolean | SchemaTimestampsConfig | undefined,
): boolean | SchemaTimestampsConfig => {
  if (typeof timestamps === "object") {
    return { createdAt: true, updatedAt: true };
  }
  return timestamps === false || timestamps === undefined ? true : timestamps;
};

/**
 * Configura as opções padrão para um schema.
 * Garante que `timestamps` esteja sempre habilitado e nunca seja duplicado.
 * @param options - Opções fornecidas pelo usuário.
 * @returns Opções configuradas com valores padrão.
 */
export const configureOptions: ConfigureOptionsType = (options = {}) => {
  const defaultOptions: Options = { timestamps: true };

  const mergedOptions: Options = {
    ...defaultOptions,
    ...options,
    timestamps: normalizeTimestamps(options.timestamps),
  };

  return mergedOptions as Omit<Options, "timestamps"> & {
    timestamps: boolean | SchemaTimestampsConfig;
  };
};
