import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENVIRONMENTS_WITH_FILES = ['production', 'staging', 'test', 'development'];

function findEnvFile(startDir, fileName = '.env') {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    const possiblePath = path.join(dir, fileName);
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
    dir = path.dirname(dir);
  }
  return null;
}

// Busca o caminho do arquivo .env ou lança um erro se não encontrar
const envPath = ENVIRONMENTS_WITH_FILES.includes(process.env.NODE_ENV)
  ? findEnvFile(__dirname, `.env.${process.env.NODE_ENV}`) || findEnvFile(__dirname)
  : findEnvFile(__dirname);

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
  EMAIL_PASSWORD,
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
  emailPassword: EMAIL_PASSWORD,
};
