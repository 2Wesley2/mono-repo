import { Validation } from "#contract-mongoose";
import {
  CollectionNameValidation,
  FieldCountValidation,
  SchemaDefinitionValidation,
  RequiredFieldsValidation,
} from "./mongoose-schema-config";

/**
 * Cria uma lista de validações para schemas.
 * @returns Lista de validações.
 */
export const createValidations = (): Validation[] => [
  new SchemaDefinitionValidation(),
  new CollectionNameValidation(),
  new FieldCountValidation(),
  new RequiredFieldsValidation(),
];
