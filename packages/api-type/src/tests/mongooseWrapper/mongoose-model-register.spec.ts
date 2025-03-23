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
      ).toThrow("OverwriteModelError");
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
      ).toThrow("Erro ao registrar o documento");
    });
  });
});
