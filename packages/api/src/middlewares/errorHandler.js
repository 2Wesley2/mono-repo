import config from '../config/index.js';
import AppError from '../errors/AppError.js';

export default (err, _req, res, _next) => {
  const { statusCode = 500, message } = err;

  if (config.nodeEnv !== 'production') {
    console.error(err);
  } else {
    console.error(err.message);
  }

  if (err instanceof AppError) {
    return res.status(statusCode).json({
      message: config.nodeEnv === 'production' ? 'Internal Server Error' : message || 'Internal Server Error',
    });
  }

  return res.status(500).json({
    message: 'Internal Server Error',
  });
};
