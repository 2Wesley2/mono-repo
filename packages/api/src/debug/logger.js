import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from '../config/index.js';

class Logger {
  constructor() {
    const logDir = path.join('logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

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
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: prodFormat,
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        format: prodFormat,
      }),
    ];

    this.logger = winston.createLogger({
      level: config.nodeEnv === 'development' ? 'debug' : 'info',
      transports,
      exceptionHandlers: [new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })],
      rejectionHandlers: [new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })],
    });
  }

  /**
   * Retorna a instância do logger configurado
   */
  getLogger() {
    return this.logger;
  }
}

const loggerInstance = new Logger();
export default loggerInstance.getLogger();
