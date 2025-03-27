import mongooseErrors from "#errors-mongoose";
import type { RegisterDocumentParams } from "#mongoose-wrapper/mongoose-types";
import { Validation } from "#contract-mongoose";

/**
 * Valida se o hookEvent é válido.
 * @param hookEvent - O evento de hook a ser validado.
 * @param validEvents - Lista de eventos válidos.
 * @param errorMessage - Mensagem de erro para eventos inválidos.
 * @throws Lança um erro se o hookEvent for inválido.
 */
export const validateHookEvent = (
  hookEvent: string | RegExp,
  validEvents: (string | RegExp)[],
  errorMessage: string,
): void => {
  const isValid =
    hookEvent instanceof RegExp || validEvents.includes(hookEvent);
  if (!isValid) {
    throw new mongooseErrors.InvalidHookEventError(
      [{ hookEvent }],
      errorMessage,
    );
  }
};

/**
 * Helper para lançar erros de validação.
 * Centraliza a lógica de construção e lançamento de erros.
 * @param errorClass - Classe de erro a ser lançada.
 * @param context - Contexto associado ao erro.
 * @param details - Detalhes adicionais do erro.
 * @param message - Mensagem de erro.
 */
export const throwValidationError = (
  errorClass: typeof mongooseErrors.GenericMongooseError,
  context: string,
  details: Array<object>,
  message: string,
): never => {
  throw new errorClass(context, details, message);
};

/**
 * Verifica se a definição do schema é válida.
 * @param schemaDefinition - A definição do schema a ser validada.
 * @returns Verdadeiro se a definição for válida, falso caso contrário.
 */
export const isValidSchemaDefinition = (
  schemaDefinition: RegisterDocumentParams<any>["schemaDefinition"],
): boolean => {
  return (
    schemaDefinition &&
    typeof schemaDefinition === "object" &&
    Object.keys(schemaDefinition).length > 0
  );
};

/**
 * Contexto para validação de parâmetros de registro de documentos.
 */
export class ValidationContext {
  private validations: Validation[] = [];

  public addValidation(validation: Validation): void {
    this.validations.push(validation);
  }

  public validate(params: RegisterDocumentParams<any>): void {
    this.validations.forEach((validation) => validation.validate(params));
  }
}
