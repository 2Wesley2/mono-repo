import config from '@/config/index.js';
import AppError from '@/errors/AppError.js';

export default (err, _req, res, _next) => {
  const statusCode = err instanceof AppError && err.statusCode ? err.statusCode : 500;
  const message = err instanceof AppError && err.message ? err.message : 'Internal Server Error';

  if (config.nodeEnv !== 'production') {
    console.error(err);
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: err.stack,
    });
  } else {
    console.error(err.message);
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
    });
  }
};
