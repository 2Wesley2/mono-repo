const COLORS = {
  reset: '\x1b[0m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[35m',
  exception: '\x1b[41m\x1b[37m',
};

function log(type, message) {
  const timestamp = new Date().toISOString();
  const color = COLORS[type] || COLORS.info;

  let formattedMessage = `${color}[${type.toUpperCase()}] ${timestamp}: ${message}${COLORS.reset}`;

  if (type === 'error' || type === 'exception') {
    const stack = new Error().stack.split('\n').slice(2).join('\n');
    formattedMessage += `\n${color}Stack Trace:\n${stack}${COLORS.reset}`;
  }

  console.log(formattedMessage);
}

const logger = {
  info: (msg) => log('info', msg),
  warn: (msg) => log('warn', msg),
  error: (msg) => log('error', msg),
  debug: (msg) => log('debug', msg),
  exception: (msg) => log('exception', msg),
};
export default logger;
