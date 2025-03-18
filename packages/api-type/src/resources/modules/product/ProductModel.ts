import { SchemaDefinition, Schema } from "mongoose";
import { Model } from "#model";
import type { RegisterDocumentParams } from "#mongoose-wrapper";
import type { SProduct } from "./contract/index";

const productSchema: SchemaDefinition<SProduct> = {
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  sku: { type: String },
  subcategory: { type: String },
  brand: { type: String },
  barcode: { type: String },
  images: { type: [String] },
  condition: {
    type: String,
    enum: ["new", "used", "refurbished"],
  },
  variations: {
    type: [
      {
        _id: false,
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
};

export default class ProductModel<T extends SProduct> extends Model<T> {
  constructor(
    schema: RegisterDocumentParams<T>["schemaDefinition"],
    modelName: RegisterDocumentParams<T>["collection"] = "Product",
    options: RegisterDocumentParams<T>["options"],
    middlewares: RegisterDocumentParams<T>["middlewares"],
  ) {
    const combinedSchema = { ...productSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }
}
