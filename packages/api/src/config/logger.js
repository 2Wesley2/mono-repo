import winston from 'winston';
import path from 'path';
import config from './env.js';

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  }),
);

const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json(),
);

const transports = [
  new winston.transports.Console({
    format: config.nodeEnv === 'development' ? devFormat : prodFormat,
  }),
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: prodFormat,
  }),
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: prodFormat,
  }),
];

// Configurando o logger como singleton
class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = winston.createLogger({
        level: config.nodeEnv === 'development' ? 'debug' : 'info',
        format: config.nodeEnv === 'development' ? devFormat : prodFormat,
        transports,
        exceptionHandlers: [new winston.transports.File({ filename: path.join('logs', 'exceptions.log') })],
        rejectionHandlers: [new winston.transports.File({ filename: path.join('logs', 'rejections.log') })],
      });

      if (config.nodeEnv === 'development') {
        Logger.instance.add(new winston.transports.Console({ format: devFormat }));
      }
    }
  }

  getLogger() {
    return Logger.instance;
  }
}

const loggerInstance = new Logger();
export default loggerInstance.getLogger();
