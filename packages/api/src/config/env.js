import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const baseDir = process.cwd();
const ENVIRONMENTS_WITH_FILES = ['production', 'staging', 'test', 'development'];

/**
 * Procura recursivamente um arquivo de ambiente a partir do diretório especificado.
 *
 * @param {string} startDir - Diretório inicial para a busca.
 * @param {string} [fileName='.env'] - Nome do arquivo de ambiente a ser procurado.
 * @returns {string|null} O caminho completo para o arquivo encontrado ou null se não encontrado.
 *
 * @example
 * const envFile = findEnvFile(process.cwd(), '.env.development');
 * if (envFile) {
 *   console.log('Arquivo encontrado:', envFile);
 * }
 */
const findEnvFile = (startDir, fileName = '.env') => {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    const possiblePath = path.join(dir, fileName);
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
    dir = path.dirname(dir);
  }
  return null;
};

const envPath = ENVIRONMENTS_WITH_FILES.includes(process.env.NODE_ENV)
  ? findEnvFile(baseDir, `.env.${process.env.NODE_ENV}`) || findEnvFile(baseDir)
  : findEnvFile(baseDir);

if (!envPath) {
  throw new Error('env.js: Arquivo de configuração .env não encontrado.');
}

dotenv.config({ path: envPath });

const requiredEnv = ['PORT', 'DB_HOST', 'DB_NAME', 'JWT_SECRET'];

requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`env.js: A variável de ambiente ${envVar} é necessária.`);
    process.exit(1);
  }
});

const {
  PORT,
  DB_ATLAS,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  JWT_SECRET,
  NODE_ENV,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD
} = process.env;

export default {
  apiPort: Number(PORT),
  dbAtlas: DB_ATLAS,
  dbHost: DB_HOST,
  dbName: DB_NAME,
  dbPassword: DB_PASSWORD,
  dbPort: Number(DB_PORT),
  dbUser: DB_USER,
  jwtSecret: JWT_SECRET,
  nodeEnv: NODE_ENV,
  twilioAccountSid: TWILIO_ACCOUNT_SID,
  twilioAuthToken: TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: TWILIO_PHONE_NUMBER,
  emailHost: EMAIL_HOST,
  emailPort: Number(EMAIL_PORT),
  emailUser: EMAIL_USER,
  emailPassword: EMAIL_PASSWORD
};
