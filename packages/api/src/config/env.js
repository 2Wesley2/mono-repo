import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const ENVIRONMENTS_WITH_FILES = ['production', 'staging', 'test'];

const envPath = ENVIRONMENTS_WITH_FILES.includes(process.env.NODE_ENV)
  ? path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
  : path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  throw new Error(`env.js: Arquivo de configuração de ambiente não encontrado: ${envPath}`);
}

dotenv.config({ path: envPath });

const requiredEnv = ['PORT', 'DB_HOST', 'DB_NAME', 'JWT_SECRET', 'MERCADO_PAGO_ACCESS_TOKEN'];
requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`env.js: A variável de ambiente ${envVar} é necessária.`);
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
  MERCADO_PAGO_ACCESS_TOKEN,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  PAGSEGURO_BASE_URL,
  PAGSEGURO_ACCESS_TOKEN,
} = process.env;

export default {
  /**
   * Porta em que a API será executada
   * @type {number}
   */
  apiPort: Number(PORT),

  /**
   * URL do banco de dados Atlas
   * @type {string}
   */
  dbAtlas: DB_ATLAS,

  /**
   * Host do banco de dados
   * @type {string}
   */
  dbHost: DB_HOST,

  /**
   * Nome do banco de dados
   * @type {string}
   */
  dbName: DB_NAME,

  /**
   * Senha do banco de dados
   * @type {string}
   */
  dbPassword: DB_PASSWORD,

  /**
   * Porta do banco de dados
   * @type {number}
   */
  dbPort: Number(DB_PORT),

  /**
   * Usuário do banco de dados
   * @type {string}
   */
  dbUser: DB_USER,

  /**
   * Segredo JWT para autenticação
   * @type {string}
   */
  jwtSecret: JWT_SECRET,

  /**
   * Ambiente Node (produção, staging, teste, etc.)
   * @type {string}
   */
  nodeEnv: NODE_ENV,

  PagSeguroAccessToken: PAGSEGURO_ACCESS_TOKEN,

  PagSeguroBaseUrl: PAGSEGURO_BASE_URL,
  /**
   * Token de acesso do Mercado Pago
   * @type {string}
   */
  mercadoPagoAccessToken: MERCADO_PAGO_ACCESS_TOKEN,

  /**
   * Configuração do Twilio
   */
  twilioAccountSid: TWILIO_ACCOUNT_SID,
  twilioAuthToken: TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: TWILIO_PHONE_NUMBER,

  /**
   * Configuração do Nodemailer
   */
  emailHost: EMAIL_HOST,
  emailPort: Number(EMAIL_PORT),
  emailUser: EMAIL_USER,
  emailPassword: EMAIL_PASSWORD,
};
