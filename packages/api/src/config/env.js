import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Lista de ambientes que possuem arquivos de configuração específicos
const ENVIRONMENTS_WITH_FILES = ['production', 'staging', 'test', 'development'];

/**
 * Define o caminho do arquivo de configuração de ambiente com base no valor de NODE_ENV.
 * Se NODE_ENV estiver listado em ENVIRONMENTS_WITH_FILES, utiliza o arquivo correspondente (e.g., .env.production).
 * Caso contrário, utiliza o arquivo padrão (.env).
 * @type {string}
 */
const envPath = ENVIRONMENTS_WITH_FILES.includes(process.env.NODE_ENV)
  ? // Resolve o caminho para o arquivo de ambiente específico
    path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
  : // Resolve o caminho para o arquivo de ambiente padrão
    path.resolve(process.cwd(), '.env');

// Verifica se o arquivo de configuração existe
if (!fs.existsSync(envPath)) {
  throw new Error(`env.js: Arquivo de configuração de ambiente não encontrado: ${envPath}`);
}

// Carrega as variáveis de ambiente a partir do arquivo
dotenv.config({ path: envPath });

// Lista de variáveis de ambiente obrigatórias
const requiredEnv = ['PORT', 'DB_HOST', 'DB_NAME', 'JWT_SECRET'];

// Itera sobre as variáveis obrigatórias e verifica se estão definidas
requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`env.js: A variável de ambiente ${envVar} é necessária.`);
    process.exit(1);
  }
});

// Desestrutura as variáveis de ambiente
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
  URL_NEW_PAYMENT_V2_GETNET,
  URL_NEW_PAYMENT_V3_GETNET,
  URL_CHECK_STATUS_GETNET,
  GETNET_SELLER_ID,
  GETNET_CLIENT_ID,
  GETNET_SECRET,
  GETNET_ENV,
  GETNET_URL_SANDBOX,
  GETNET_URL_PRODUCTION,
  GETNET_URL_HOMOLOG,
} = process.env;

// Exporta as configurações como um objeto
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

  /**
   * URLs para integração com GetNet
   */
  urlNewPaymentV2Getnet: URL_NEW_PAYMENT_V2_GETNET,
  urlNewPaymentV3Getnet: URL_NEW_PAYMENT_V3_GETNET,
  urlCheckStatusGetnet: URL_CHECK_STATUS_GETNET,

  getnetSellerId: GETNET_SELLER_ID,
  getnetClientId: GETNET_CLIENT_ID,
  getnetSecret: GETNET_SECRET,
  getnetEnv: GETNET_ENV,

  getnetUrlSandbox: GETNET_URL_SANDBOX,
  getnetUrlProduction: GETNET_URL_PRODUCTION,
  getnetUrlHomolog: GETNET_URL_HOMOLOG,
};
