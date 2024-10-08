import Joi from 'joi';

/**
 * Middleware para validar requisições usando Joi.
 * @param {Joi.Schema} schema - Schema de validação.
 * @returns {Function} - Função middleware.
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: messages });
    }

    next();
  };
};

export default validateRequest;
