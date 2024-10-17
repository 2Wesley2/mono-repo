import config from '../config/index.js';
import AppError from '../errors/AppError.js';

export default (err, _req, res, _next) => {
  // Certifica-se de que o statusCode seja um número
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (config.nodeEnv !== 'production') {
    console.error(err);
  } else {
    console.error(err.message);
  }

  // Tratamento específico para erros do tipo AppError
  if (err instanceof AppError) {
    return res.status(statusCode).json({
      message: config.nodeEnv === 'production' ? 'Internal Server Error' : message,
    });
  }

  // Tratamento para outros tipos de erros
  return res.status(500).json({
    message: 'Internal Server Error',
  });
};
