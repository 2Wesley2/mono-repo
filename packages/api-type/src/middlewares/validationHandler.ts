import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction, RequestHandler } from "express";

export const validateOwner: RequestHandler[] = [
  body("cpf").isLength({ min: 11, max: 11 }).withMessage("CPF inválido"),
  body("firstName").notEmpty().withMessage("Primeiro nome é obrigatório"),
  body("lastName").notEmpty().withMessage("Último nome é obrigatório"),
  body("birthDate").isDate().withMessage("Data de nascimento inválida"),
  body("street").optional().isString(),
  body("neighborhood").optional().isString(),
  body("houseNumber").optional().isString(),
  body("postalCode").optional().isString(),
  body("city").optional().isString(),
  body("state").optional().isString(),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter pelo menos 6 caracteres"),
  body("cnpj").isLength({ min: 14, max: 14 }).withMessage("CNPJ inválido"),
  body("legalName").notEmpty().withMessage("Nome legal é obrigatório"),
  body("tradeName").optional().isString(),
  (req: Request, res: Response, next: NextFunction) => {
    const errorsResult = validationResult(req);
    if (!errorsResult.isEmpty()) {
      res.status(400).json({ errors: errorsResult.array() });
    }
    next();
  },
];
