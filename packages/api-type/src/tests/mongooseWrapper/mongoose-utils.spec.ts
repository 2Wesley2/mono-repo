import type { MiddlewareConfig } from "#mongoose-wrapper";
import mongoose, { Schema } from "mongoose";
import {
  StringHookEventValidator,
  RegExpHookEventValidator,
  MiddlewareContext,
  MiddlewareValidationContext,
  ErrorHandlingContext,
  ValidationContext,
  SchemaDefinitionValidation,
  OptionsValidation,
  CollectionNameValidation,
  FieldCountValidation,
} from "#mongoose-wrapper";

describe("StringHookEventValidator.validate() método validate", () => {
  let validator: StringHookEventValidator;

  beforeEach(() => {
    validator = new StringHookEventValidator();
  });

  describe("método validate", () => {
    it("deve validar com sucesso quando hookEvent é uma string", () => {
      const middlewareConfig: MiddlewareConfig = {
        method: "pre",
        hookEvent: "createCollection",
        fn: jest.fn(),
      } as any;

      expect(() => validator.validate(middlewareConfig)).not.toThrow();
    });

    it("deve lançar um erro quando hookEvent não for uma string", () => {
      const middlewareConfig: MiddlewareConfig = {
        method: "pre",
        hookEvent: /createCollection/,
        fn: jest.fn(),
      } as any;

      expect(() => validator.validate(middlewareConfig)).toThrow(
        "hookEvent inválido: esperado um valor do tipo string.", // Corrigido para corresponder à implementação
      );
    });
  });
});

describe("MiddlewareValidationContext", () => {
  let validationContext: MiddlewareValidationContext;

  beforeEach(() => {
    validationContext = new MiddlewareValidationContext();
  });

  it("deve validar com sucesso quando hookEvent é um evento válido", () => {
    const middlewareConfig: MiddlewareConfig = {
      method: "pre",
      hookEvent: "createCollection", // Ajustado para um valor válido
      fn: jest.fn(),
    };
    expect(() => validationContext.validate(middlewareConfig)).not.toThrow();
  });

  it("deve validar com sucesso quando hookEvent é uma RegExp", () => {
    const middlewareConfig: MiddlewareConfig = {
      method: "pre",
      hookEvent: /save/,
      fn: jest.fn(),
    };
    expect(() => validationContext.validate(middlewareConfig)).not.toThrow();
  });

  it("deve lançar erro para hookEvent inválido", () => {
    const middlewareConfig = {
      method: "pre",
      hookEvent: 123 as unknown as "createCollection",
      fn: jest.fn(),
    } as MiddlewareConfig;
    expect(() => validationContext.validate(middlewareConfig)).toThrow(
      "Tipo de hookEvent inválido: number",
    );
  });
});

describe("ValidationContext", () => {
  let validationContext: ValidationContext;

  beforeEach(() => {
    validationContext = new ValidationContext();
    validationContext.addValidation(new SchemaDefinitionValidation());
    validationContext.addValidation(new OptionsValidation());
    validationContext.addValidation(new CollectionNameValidation());
    validationContext.addValidation(new FieldCountValidation());
  });

  it("deve validar com sucesso parâmetros válidos", () => {
    const params = {
      schemaDefinition: { field1: String },
      options: { timestamps: true },
      collection: "valid_collection",
      middlewares: [],
    };
    expect(() => validationContext.validate(params)).not.toThrow();
  });

  it("deve lançar erro para definição de schema inválida", () => {
    const params = {
      schemaDefinition: {},
      options: { timestamps: true },
      collection: "valid_collection",
      middlewares: [],
    };
    expect(() => validationContext.validate(params)).toThrow(
      "Definição de schema inválida.",
    );
  });

  it("deve lançar erro para opções inválidas", () => {
    const params = {
      schemaDefinition: { field1: String },
      options: { timestamps: undefined },
      collection: "valid_collection",
      middlewares: [],
    };
    expect(() => validationContext.validate(params)).toThrow(
      "Opções inválidas.",
    );
  });

  it("deve lançar erro para nome de coleção inválido", () => {
    const params = {
      schemaDefinition: { field1: String },
      options: { timestamps: true },
      collection: "invalid collection!",
      middlewares: [],
    };
    expect(() => validationContext.validate(params)).toThrow(
      'O nome da coleção "invalid collection!" contém caracteres inválidos.',
    );
  });

  it("deve lançar erro para schema com mais de 10.000 campos", () => {
    const params = {
      schemaDefinition: Object.fromEntries(
        Array.from({ length: 10001 }, (_, i) => [`field${i}`, String]),
      ),
      options: { timestamps: true },
      collection: "large_collection",
      middlewares: [],
    };
    expect(() => validationContext.validate(params)).toThrow(
      'O schema para a coleção "large_collection" excede o limite de 10.000 campos.',
    );
  });

  it("deve emitir aviso para schema com mais de 500 campos", () => {
    const params = {
      schemaDefinition: Object.fromEntries(
        Array.from({ length: 501 }, (_, i) => [`field${i}`, String]),
      ),
      options: { timestamps: true },
      collection: "large_collection",
      middlewares: [],
    };
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    validationContext.validate(params);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Aviso: O schema para a coleção "large_collection" contém 501 campos.',
    );
    consoleWarnSpy.mockRestore();
  });
});

describe("ErrorHandlingContext", () => {
  let errorHandlingContext: ErrorHandlingContext;

  beforeEach(() => {
    errorHandlingContext = new ErrorHandlingContext();
  });

  it("deve retornar modelo existente para erro OverwriteModelError", () => {
    const error = new Error("Modelo já existe");
    error.name = "OverwriteModelError";
    mongoose.models["test"] = {} as any;
    expect(errorHandlingContext.handleError(error, "test")).toBe(
      mongoose.models["test"],
    );
  });

  it("deve lançar erro para MissingSchemaError", () => {
    const error = new Error("Esquema ausente");
    error.name = "MissingSchemaError";
    expect(() => errorHandlingContext.handleError(error, "test")).toThrow(
      'Erro: esquema não encontrado para o modelo "test" (MissingSchemaError).',
    );
  });

  it("deve lançar erro genérico para outros erros", () => {
    const error = new Error("Erro desconhecido");
    expect(() => errorHandlingContext.handleError(error, "test")).toThrow(
      'Erro genérico ao registrar o modelo "test": Erro desconhecido',
    );
  });
});
