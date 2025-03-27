import type { Schema } from "mongoose";
import type { MiddlewareConfig } from "#mongoose-wrapper/mongoose-types";
import mongooseErrors from "#errors-mongoose";
import {
  Middleware,
  MiddlewareValidator,
  IMiddlewareProcessor,
} from "#contract-mongoose";
import {
  throwValidationError,
  validateHookEvent,
  isValidRegExp,
  shouldCloneSchema,
} from "#mongoose-wrapper/mongoose-utils";

/**
 * Validação para eventos de hook do tipo string.
 */
export class StringHookEventValidator extends MiddlewareValidator {
  public validate(middleware: MiddlewareConfig): void {
    if (typeof middleware.hookEvent !== "string") {
      throwValidationError(
        mongooseErrors.GenericMongooseError,
        "Middleware",
        [{ hookEvent: middleware.hookEvent }],
        `hookEvent inválido: esperado um valor do tipo string.`,
      );
    }
  }
}

/**
 * Validação para eventos de hook do tipo RegExp.
 */
export class RegExpHookEventValidator extends MiddlewareValidator {
  public validate(middleware: MiddlewareConfig): void {
    if (!(middleware.hookEvent instanceof RegExp)) {
      throwValidationError(
        mongooseErrors.GenericMongooseError,
        "Middleware",
        [{ hookEvent: middleware.hookEvent }],
        `Tipo de hookEvent inválido: ${typeof middleware.hookEvent}`,
      );
    }
    if (
      middleware.hookEvent instanceof RegExp &&
      !isValidRegExp(middleware.hookEvent)
    ) {
      throwValidationError(
        mongooseErrors.GenericMongooseError,
        "Middleware",
        [{ hookEvent: middleware.hookEvent }],
        `hookEvent inválido: expressão regular inválida.`,
      );
    }
  }
}

/**
 * Implementação de middleware para eventos "pre".
 */
export class PreMiddleware extends Middleware {
  public apply(
    schema: Schema,
    middleware: MiddlewareConfig & { hookEvent: RegExp | "createCollection" },
  ): void {
    applyMiddlewareWithValidation(
      schema,
      middleware,
      ["createCollection"],
      `hookEvent inválido: esperado "RegExp" ou "createCollection", mas recebido "${middleware.hookEvent}".`,
    );
  }
}

/**
 * Implementação de middleware para eventos "post".
 */
export class PostMiddleware extends Middleware {
  public apply(
    schema: Schema,
    middleware: MiddlewareConfig & {
      hookEvent: "insertMany" | "bulkWrite" | RegExp;
    },
  ): void {
    applyMiddlewareWithValidation(
      schema,
      middleware,
      ["insertMany", "bulkWrite"],
      `hookEvent inválido: esperado "RegExp", "insertMany" ou "bulkWrite", mas recebido "${middleware.hookEvent}".`,
    );
  }
}

/**
 * Função auxiliar para aplicar middlewares com validação de eventos.
 * @param schema - O schema do Mongoose.
 * @param middleware - Configuração do middleware.
 * @param validEvents - Lista de eventos válidos.
 * @param errorMessage - Mensagem de erro para eventos inválidos.
 */
const applyMiddlewareWithValidation = (
  schema: Schema,
  middleware: MiddlewareConfig,
  validEvents: (string | RegExp)[],
  errorMessage: string,
): void => {
  validateHookEvent(middleware.hookEvent, validEvents, errorMessage);

  if (middleware.method === "pre") {
    schema.pre(middleware.hookEvent as any, middleware.fn);
  } else if (middleware.method === "post") {
    schema.post(middleware.hookEvent as any, middleware.fn);
  } else {
    throw new mongooseErrors.InvalidHookEventError(
      [{ method: (middleware as MiddlewareConfig).method }],
      `Método de middleware inválido: ${(middleware as MiddlewareConfig).method}`,
    );
  }
};

/** Classes principais */

/**
 * Contexto para aplicação de middlewares.
 */
export class MiddlewareContext {
  private middlewares: Record<string, Middleware>;

  constructor() {
    this.middlewares = {
      pre: new PreMiddleware(),
      post: new PostMiddleware(),
    };
  }

  public applyMiddleware(schema: Schema, middleware: MiddlewareConfig): void {
    const middlewareInstance = this.middlewares[middleware.method];
    if (!middlewareInstance) {
      throw new Error(`Método de middleware inválido: ${middleware.method}`);
    }
    middlewareInstance.apply(schema, middleware);
  }
}

/**
 * Contexto para validação de middlewares.
 */
export class MiddlewareValidationContext {
  private validators: Map<string, MiddlewareValidator>;

  constructor() {
    this.validators = new Map<string, MiddlewareValidator>([
      ["string", new StringHookEventValidator()],
      ["regexp", new RegExpHookEventValidator()],
    ]);
  }

  /**
   * Registra dinamicamente um validador.
   * @param type - Tipo de hookEvent.
   * @param validator - Instância do validador.
   */
  public registerValidator(type: string, validator: MiddlewareValidator): void {
    if (this.validators.has(type)) {
      throw new Error(`Validador para o tipo "${type}" já está registrado.`);
    }
    this.validators.set(type, validator);
  }

  /**
   * Valida o middleware com base no tipo de hookEvent.
   * @param middleware - Configuração do middleware.
   * @throws Lança erro se o tipo de hookEvent for inválido ou não suportado.
   */
  public validate(middleware: MiddlewareConfig): void {
    const type = this.getHookEventType(middleware.hookEvent);
    const validator = this.validators.get(type);

    if (!validator) {
      throw new Error(
        `Tipo de hookEvent inválido ou não suportado: "${type}". Certifique-se de registrar um validador apropriado.`,
      );
    }

    validator.validate(middleware);
  }

  /**
   * Determina o tipo de hookEvent.
   * @param hookEvent - O evento a ser validado.
   * @returns O tipo do hookEvent como string.
   * @throws Lança erro se o hookEvent não for uma string ou RegExp.
   */
  private getHookEventType(hookEvent: unknown): string {
    if (typeof hookEvent === "string") {
      return "string";
    }
    if (hookEvent instanceof RegExp) {
      return "regexp";
    }
    throw new mongooseErrors.InvalidHookEventError(
      [{ hookEvent }],
      `Tipo de hookEvent inválido: esperado "string" ou "RegExp", mas recebido "${typeof hookEvent}".`,
    );
  }
}
/**
 * Serviço para validação de middlewares.
 */
export class MiddlewareValidatorService {
  /**
   * Verifica se há middlewares válidos.
   * @param middlewares - Array de middlewares a ser verificado.
   * @returns Verdadeiro se houver middlewares válidos, falso caso contrário.
   */
  public hasValidMiddlewares(middlewares: MiddlewareConfig[] = []): boolean {
    return !!middlewares && middlewares.length > 0;
  }

  /**
   * Valida se o array de middlewares é válido.
   * @param middlewares - Array de middlewares a ser validado.
   * @throws Lança um erro específico se algum middleware for inválido.
   */
  public validateMiddlewares(middlewares: MiddlewareConfig[] = []): void {
    if (!this.hasValidMiddlewares(middlewares)) {
      return;
    }
    middlewares.forEach((middleware, index) => {
      this.validateMiddleware(middleware, index);
    });
  }

  /**
   * Valida um middleware individualmente.
   * @param middleware - O middleware a ser validado.
   * @param index - O índice do middleware no array.
   * @throws Lança um erro se o middleware for inválido.
   */
  private validateMiddleware(
    middleware: MiddlewareConfig,
    index: number,
  ): void {
    if (!middleware || typeof middleware !== "object") {
      throw new mongooseErrors.InvalidMiddlewareError(
        [{ index, middleware }],
        `Middleware inválido na posição ${index}: esperado um objeto válido.`,
      );
    }
    if (!middleware.method || !middleware.hookEvent || !middleware.fn) {
      throw new mongooseErrors.InvalidMiddlewareError(
        [{ index, middleware }],
        `Middleware inválido na posição ${index}: propriedades obrigatórias ausentes.`,
      );
    }
  }
}

export class MiddlewareProcessor implements IMiddlewareProcessor {
  private readonly context: MiddlewareContext;
  private readonly validationContext: MiddlewareValidationContext;
  private readonly validatorService: MiddlewareValidatorService;
  private readonly hooks: {
    beforeProcess?: (schema: Schema, middlewares: MiddlewareConfig[]) => void;
    afterProcess?: (schema: Schema) => void;
  };

  constructor(
    context: MiddlewareContext,
    validationContext: MiddlewareValidationContext,
    validatorService: MiddlewareValidatorService,
    hooks: {
      beforeProcess?: (schema: Schema, middlewares: MiddlewareConfig[]) => void;
      afterProcess?: (schema: Schema) => void;
    } = {},
  ) {
    this.context = context;
    this.validationContext = validationContext;
    this.validatorService = validatorService;
    this.hooks = hooks;
  }

  public process(schema: Schema, middlewares: MiddlewareConfig[] = []): Schema {
    if (!this.validatorService.hasValidMiddlewares(middlewares)) {
      return schema; // Retorna o schema original se não houver middlewares.
    }

    this.hooks.beforeProcess?.(schema, middlewares); // Hook antes do processamento.

    const updatedSchema = shouldCloneSchema(middlewares)
      ? schema.clone()
      : schema;

    middlewares.forEach((mw: MiddlewareConfig) => {
      this.context.applyMiddleware(updatedSchema, mw);
    });

    this.hooks.afterProcess?.(updatedSchema); // Hook após o processamento.

    return updatedSchema;
  }
}
