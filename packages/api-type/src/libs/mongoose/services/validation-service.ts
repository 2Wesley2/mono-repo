import { ValidationContext } from "#mongoose-wrapper/utils/mongoose-validation";
import { createValidations } from "#mongoose-wrapper/schemas/schema-validations";
import type { RegisterDocumentParams } from "#mongoose-wrapper/common/mongoose-types";
import { IValidationService } from "#mongoose-wrapper/common/mongoose-types";

/**
 * Serviço responsável por validar parâmetros de schema.
 */
export class ValidationService implements IValidationService {
  private readonly validationContext: ValidationContext;

  constructor() {
    this.validationContext = new ValidationContext();
    const validations = createValidations();
    validations.forEach((validation) =>
      this.validationContext.addValidation(validation),
    );
  }

  public validate(params: RegisterDocumentParams<any>): void {
    this.validationContext.validate(params);
  }
}
