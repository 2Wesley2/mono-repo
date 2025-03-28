import {
  SchemaCreator,
  SchemaBuilder,
} from "../schemas/mongoose-schema-config";
import { ValidationService } from "../services/validation-service";
import {
  MiddlewareProcessor,
  MiddlewareContext,
  MiddlewareValidatorService,
} from "../middlewares/mongoose-middlewares";
import { configureOptions } from "../utils/mongoose-options";
import { MiddlewareConfig } from "../common/mongoose-types";

describe("SchemaBuilder", () => {
  it("deve criar um schema válido com middlewares aplicados", () => {
    const mockErrorHandler = {
      handle: jest.fn() as jest.Mock<never, [unknown, string]>,
    };
    const validationService = new ValidationService();
    const schemaCreator = new SchemaCreator(
      mockErrorHandler,
      validationService,
    );
    const middlewareContext = new MiddlewareContext();
    const middlewareProcessor = new MiddlewareProcessor(
      middlewareContext,
      jest.fn() as any,
      new MiddlewareValidatorService(),
    );

    const schemaBuilder = new SchemaBuilder(schemaCreator, middlewareProcessor);

    const schemaDefinition = { name: { type: String, required: true } };
    const collection = "testCollection";
    const options = configureOptions({ timestamps: false });
    const middlewares: MiddlewareConfig[] = [];

    const schema = schemaBuilder.build(
      schemaDefinition,
      collection,
      options,
      middlewares,
    );

    expect(schema).toBeDefined();
    expect(schema.obj).toHaveProperty("name");
  });

  it("deve lançar erro ao criar schema com definição inválida", () => {
    const mockErrorHandler = {
      handle: jest.fn((error: unknown, collection: string) => {
        throw error;
      }) as jest.Mock<never, [unknown, string]>,
    };

    const schemaCreator = new SchemaCreator(
      mockErrorHandler,
      new ValidationService(),
    );

    const schemaDefinition = {};
    const collection = "invalidCollection";

    expect(() => {
      schemaCreator.create({ schemaDefinition, collection, middlewares: [] });
    }).toThrow("Definição de schema inválida: não pode ser vazia.");
  });
});
