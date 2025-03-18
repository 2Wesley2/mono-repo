import { Schema } from "mongoose";

export interface Variation {
  name: string;
  value: string;
}

export interface SProduct {
  owner_id: Schema.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku?: string;
  subcategory?: string;
  brand?: string;
  barcode?: string;
  images?: string[];
  condition?: "new" | "used" | "refurbished";
  variations?: Variation[];
}
