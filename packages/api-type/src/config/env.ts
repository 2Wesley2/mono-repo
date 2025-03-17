import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Config } from "./type";

const baseDir = process.cwd();

const findEnvFile = (startDir: string, fileName: string): string | null => {
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

const baseEnvPath = findEnvFile(baseDir, ".env");
if (!baseEnvPath) {
  throw new Error("env.ts: Arquivo base .env não encontrado.");
}

dotenv.config({ path: baseEnvPath });

const nodeEnv = process.env.NODE_ENV || "development";

const envSpecificPath = findEnvFile(baseDir, `.env.${nodeEnv}`);
if (envSpecificPath) {
  dotenv.config({ path: envSpecificPath });
} else {
  console.warn(
    `env.ts: Arquivo .env.${nodeEnv} não encontrado, usando somente o base .env`,
  );
}

const requiredEnv = ["PORT", "DB_HOST", "DB_NAME", "JWT_SECRET"];
requiredEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`env.ts: A variável de ambiente ${envVar} é necessária.`);
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

const config: Config = {
  apiPort: Number(PORT),
  dbAtlas: DB_ATLAS,
  dbHost: DB_HOST!,
  dbName: DB_NAME!,
  dbPassword: DB_PASSWORD,
  dbPort: Number(DB_PORT),
  dbUser: DB_USER,
  jwtSecret: JWT_SECRET!,
  nodeEnv: NODE_ENV!,
  twilioAccountSid: TWILIO_ACCOUNT_SID,
  twilioAuthToken: TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: TWILIO_PHONE_NUMBER,
  emailHost: EMAIL_HOST,
  emailPort: EMAIL_PORT ? Number(EMAIL_PORT) : undefined,
  emailUser: EMAIL_USER,
  emailPassword: EMAIL_PASSWORD,
} as const;

export default config;
