import mongoose, { Schema, model } from "mongoose";
import { MongooseModelRegister } from "#mongoose-wrapper";
import type { MiddlewareConfig } from "#mongoose-wrapper";

describe("MongooseModelRegister", () => {
  describe("addMiddleware", () => {
    it("deve adicionar middlewares ao schema", () => {
      const schema = new Schema({});
      const middlewares: MiddlewareConfig[] = [
        {
          method: "pre",
          hookEvent: "createCollection",
          fn: jest.fn(),
        },
        {
          method: "post",
          hookEvent: "insertMany",
          fn: jest.fn(),
        },
      ];

      const updatedSchema = MongooseModelRegister.addMiddleware(
        schema,
        middlewares,
      );

      expect(updatedSchema).toBe(schema);
      middlewares.forEach((mw) => {
        if (mw.method === "pre") {
          expect(() => schema.pre(mw.hookEvent, mw.fn)).not.toThrow();
        } else if (mw.method === "post") {
          expect(() => schema.post(mw.hookEvent, mw.fn)).not.toThrow();
        }
      });
    });

    it("deve lidar com middlewares vazios", () => {
      const schema = new Schema({});
      const updatedSchema = MongooseModelRegister.addMiddleware(schema, []);
      expect(updatedSchema).toBe(schema);
    });

    it("deve lançar erro para middlewares inválidos", () => {
      const schema = new Schema({});
      const invalidMiddleware: any = [{ method: "invalid", hookEvent: "test" }];

      expect(() =>
        MongooseModelRegister.addMiddleware(schema, invalidMiddleware),
      ).toThrow();
    });

    it("deve lançar erro se middlewares não for um array", () => {
      const schema = new Schema({});
      const invalidMiddlewares: any = "notAnArray";

      expect(() =>
        MongooseModelRegister.addMiddleware(schema, invalidMiddlewares),
      ).toThrow("Middlewares deve ser um array do tipo MiddlewareConfig.");
    });

    it("deve lançar erro para método de middleware inválido", () => {
      const schema = new Schema({});
      const invalidMiddlewares: MiddlewareConfig[] = [
        {
          method: "invalid" as any,
          hookEvent: "createCollection",
          fn: jest.fn(),
        },
      ];

      expect(() =>
        MongooseModelRegister.addMiddleware(schema, invalidMiddlewares),
      ).toThrow("Método de middleware inválido");
    });

    it("deve lançar erro para hookEvent inválido", () => {
      const schema = new Schema({});
      const invalidMiddlewares: MiddlewareConfig[] = [
        { method: "pre", hookEvent: null as any, fn: jest.fn() },
      ];

      expect(() =>
        MongooseModelRegister.addMiddleware(schema, invalidMiddlewares),
      ).toThrow("hookEvent inválido");
    });

    it("deve lançar erro se o schema for null ou undefined", () => {
      const middlewares: MiddlewareConfig[] = [
        { method: "pre", hookEvent: "createCollection", fn: jest.fn() },
      ];

      expect(() =>
        MongooseModelRegister.addMiddleware(null as any, middlewares),
      ).toThrow("Cannot read properties of null");

      expect(() =>
        MongooseModelRegister.addMiddleware(undefined as any, middlewares),
      ).toThrow("Cannot read properties of undefined");
    });

    it("deve lançar erro para middlewares com hookEvent inválido", () => {
      const schema = new Schema({});
      const invalidMiddlewares: MiddlewareConfig[] = [
        { method: "pre", hookEvent: {} as any, fn: jest.fn() },
      ];

      expect(() =>
        MongooseModelRegister.addMiddleware(schema, invalidMiddlewares),
      ).toThrow("hookEvent inválido");
    });

    it("deve lançar erro para middlewares com função inválida", () => {
      const schema = new Schema({});
      const invalidMiddlewares: MiddlewareConfig[] = [
        { method: "pre", hookEvent: "createCollection", fn: null as any },
      ];

      expect(() =>
        MongooseModelRegister.addMiddleware(schema, invalidMiddlewares),
      ).toThrow();
    });

    it("deve lidar com grande volume de middlewares", () => {
      const schema = new Schema({});
      const middlewares: MiddlewareConfig[] = Array.from({ length: 1000 }).map(
        (_, index) => ({
          method: "pre",
          hookEvent: "createCollection",
          fn: jest.fn(),
        }),
      );

      const updatedSchema = MongooseModelRegister.addMiddleware(
        schema,
        middlewares,
      );

      expect(updatedSchema).toBe(schema);
    });

    it("deve lançar erro para middlewares com hookEvent como RegExp inválido", () => {
      const schema = new Schema({});
      const invalidMiddlewares: MiddlewareConfig[] = [
        {
          method: "pre",
          hookEvent: new RegExp("invalidRegex(") as any,
          fn: jest.fn(),
        },
      ];

      expect(() =>
        MongooseModelRegister.addMiddleware(schema, invalidMiddlewares),
      ).toThrow("hookEvent inválido: expressão regular inválida");
    });
  });

  describe("registerDocument", () => {
    it("deve registrar um modelo com sucesso", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "testCollection";
      const options = { timestamps: true };
      const middlewares: MiddlewareConfig[] = [
        {
          method: "pre",
          hookEvent: "createCollection",
          fn: jest.fn(),
        },
      ];

      const model = MongooseModelRegister.registerDocument(
        schemaDefinition,
        collection,
        options,
        middlewares,
      );

      expect(model).toBeDefined();
      expect(model.modelName).toBe(collection);
    });

    it("deve lançar erro para modelo duplicado", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "duplicateCollection";
      const options = { timestamps: true };

      const firstModel = MongooseModelRegister.registerDocument(
        schemaDefinition,
        collection,
        options,
        [],
      );

      const secondModel = MongooseModelRegister.registerDocument(
        schemaDefinition,
        collection,
        options,
        [],
      );

      expect(secondModel).toBe(firstModel);
    });

    it("deve lançar erro para schema inválido", () => {
      const schemaDefinition: any = null;
      const collection = "invalidSchemaCollection";
      const options = { timestamps: true };

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          collection,
          options,
          [],
        ),
      ).toThrow("Erro ao registrar o documento");
    });

    it("deve lidar com middlewares vazios", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "noMiddlewareCollection";
      const options = { timestamps: true };

      const model = MongooseModelRegister.registerDocument(
        schemaDefinition,
        collection,
        options,
        [],
      );

      expect(model).toBeDefined();
      expect(model.modelName).toBe(collection);
    });

    it("deve lançar erro para opções inválidas", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "invalidOptionsCollection";
      const options: any = "invalid";

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          collection,
          options,
          [],
        ),
      ).toThrow("Opções inválidas.");
    });

    it("deve lançar erro para collection inválida", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const invalidCollection: any = null;
      const options = { timestamps: true };

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          invalidCollection,
          options,
          [],
        ),
      ).toThrow("Erro ao registrar o documento");
    });

    it("deve lançar erro para schemaDefinition inválido", () => {
      const invalidSchemaDefinition: any = "invalid";
      const collection = "testCollection";
      const options = { timestamps: true };

      expect(() =>
        MongooseModelRegister.registerDocument(
          invalidSchemaDefinition,
          collection,
          options,
          [],
        ),
      ).toThrow("Definição de schema inválida.");
    });

    it("deve lançar erro para middlewares com método inválido", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "testCollection";
      const options = { timestamps: true };
      const invalidMiddlewares: MiddlewareConfig[] = [
        {
          method: "invalid" as any,
          hookEvent: "createCollection",
          fn: jest.fn(),
        },
      ];

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          collection,
          options,
          invalidMiddlewares,
        ),
      ).toThrow("Método de middleware inválido");
    });

    it("deve lançar erro para opções inválidas", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "testCollection";
      const invalidOptions: any = "invalid";

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          collection,
          invalidOptions,
          [],
        ),
      ).toThrow("Opções inválidas.");
    });

    it("deve lançar erro para modelo duplicado", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "duplicateCollection";
      const options = { timestamps: true };

      MongooseModelRegister.registerDocument(
        schemaDefinition,
        collection,
        options,
        [],
      );

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          collection,
          options,
          [],
        ),
      ).not.toThrow();
    });

    it("deve lançar erro para erro genérico ao registrar modelo", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "testCollection";
      const options = { timestamps: true };

      jest.spyOn(mongoose, "model").mockImplementationOnce(() => {
        throw new Error("Erro genérico");
      });

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          collection,
          options,
          [],
        ),
      ).toThrow("Erro genérico ao registrar o modelo");
    });

    it("deve lidar com grande volume de dados no schema", () => {
      const largeSchemaDefinition = Array.from({ length: 1000 }).reduce<
        Record<string, any>
      >(
        (acc, _, index) => {
          acc[`field${index}`] = { type: String };
          return acc;
        },
        {} as Record<string, any>,
      );
      const collection = "largeSchemaCollection";
      const options = { timestamps: true };

      const model = MongooseModelRegister.registerDocument(
        largeSchemaDefinition,
        collection,
        options,
        [],
      );

      expect(model).toBeDefined();
      expect(model.modelName).toBe(collection);
    });

    it("deve lançar erro para collection com caracteres especiais", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const invalidCollection = "invalid@collection";
      const options = { timestamps: true };

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          invalidCollection,
          options,
          [],
        ),
      ).toThrow(
        `O nome da coleção "invalid@collection" contém caracteres inválidos.`,
      );
    });

    it("deve lançar erro para schemaDefinition com tipos inválidos", () => {
      const invalidSchemaDefinition = { name: { type: "InvalidType" } };
      const collection = "testCollection";
      const options = { timestamps: true };

      expect(() =>
        MongooseModelRegister.registerDocument(
          invalidSchemaDefinition as any,
          collection,
          options,
          [],
        ),
      ).toThrow();
    });

    it("deve lidar com grande volume de dados no schema", () => {
      const largeSchemaDefinition = Array.from({ length: 10000 }).reduce<
        Record<string, any>
      >(
        (acc, _, index) => {
          acc[`field${index}`] = { type: String };
          return acc;
        },
        {} as Record<string, any>,
      );
      const collection = "largeSchemaCollection";
      const options = { timestamps: true };

      const model = MongooseModelRegister.registerDocument(
        largeSchemaDefinition,
        collection,
        options,
        [],
      );

      expect(model).toBeDefined();
      expect(model.modelName).toBe(collection);
    });

    it("deve lançar erro para middlewares com hookEvent como RegExp inválido", () => {
      const schemaDefinition = { name: { type: String, required: true } };
      const collection = "testCollection";
      const options = { timestamps: true };
      const invalidMiddlewares: MiddlewareConfig[] = [
        {
          method: "pre",
          hookEvent: new RegExp("invalidRegex(") as any,
          fn: jest.fn(),
        },
      ];

      expect(() =>
        MongooseModelRegister.registerDocument(
          schemaDefinition,
          collection,
          options,
          invalidMiddlewares,
        ),
      ).toThrow("hookEvent inválido: expressão regular inválida");
    });

    it("deve lançar erro para schemaDefinition com mais de 10000 campos", () => {
      const largeSchemaDefinition = Array.from({ length: 10001 }).reduce<
        Record<string, any>
      >(
        (acc, _, index) => {
          acc[`field${index}`] = { type: String };
          return acc;
        },
        {} as Record<string, any>,
      );
      const collection = "largeSchemaCollection";
      const options = { timestamps: true };

      expect(() =>
        MongooseModelRegister.registerDocument(
          largeSchemaDefinition,
          collection,
          options,
          [],
        ),
      ).toThrow(
        `O schema para a coleção "largeSchemaCollection" excede o limite de 10.000 campos.`,
      );
    });
  });
});
