import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from '../config/index.js';
// Extensões de protótipos para análise avançada de dados
Object.prototype.inspectType = function () {
  if (this === null) return 'null';
  if (Array.isArray(this)) {
    const types = [...new Set(this.map((item) => typeof item))];
    return `array (${types.join(', ')})`;
  }
  if (typeof this === 'object' && this.constructor && this.constructor.name !== 'Object') {
    return `object (${this.constructor.name})`;
  }
  return 'object (plain)';
};

Object.prototype.truncate = function (maxLength = 500) {
  if (typeof this === 'string') {
    return this.length > maxLength ? `${this.substring(0, maxLength)}... (truncated)` : this;
  }
  if (typeof this === 'object') {
    // Retorna o objeto sem modificar se ele for pequeno
    const json = JSON.stringify(this, null, 2);
    if (json.length > maxLength) {
      try {
        return JSON.parse(json.substring(0, maxLength) + '}'); // Trunca sem invalidar JSON
      } catch {
        return '[Truncated object]';
      }
    }
    return this; // Objeto original, sem modificar
  }
  return this;
};

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
    this.logger.superdebug = this.superdebug.bind(this);
  }

  superdebug(message, data) {
    // Lida com valores `null` ou `undefined`
    if (data === null || data === undefined) {
      const logObject = {
        message,
        type: data === null ? 'null' : 'undefined', // Identifica o tipo
        data: data, // Registra o valor literal (`null` ou `undefined`)
        timestamp: new Date().toISOString(),
      };

      // Loga o objeto diretamente
      this.logger.debug(logObject);

      // Salva o log em `superdebug.json`
      const filePath = path.join('logs', 'superdebug.json');
      try {
        const currentLogs = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
        currentLogs.push(logObject);
        fs.writeFileSync(filePath, JSON.stringify(currentLogs, null, 2));
      } catch (error) {
        this.logger.error(`Erro ao salvar log no arquivo superdebug.json: ${error.message}`);
      }

      return;
    }

    // Trata outros valores normalmente
    try {
      const logObject = {
        message,
        type: data.inspectType(),
        data: data.truncate(2000),
        timestamp: new Date().toISOString(),
      };

      this.logger.debug(logObject);

      const filePath = path.join('logs', 'superdebug.json');
      try {
        const currentLogs = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
        currentLogs.push(logObject);
        fs.writeFileSync(filePath, JSON.stringify(currentLogs, null, 2));
      } catch (error) {
        this.logger.error(`Erro ao salvar log no arquivo superdebug.json: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Erro ao processar log no superdebug: ${error.message}`);
    }
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
