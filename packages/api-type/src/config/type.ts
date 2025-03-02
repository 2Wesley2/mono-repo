export interface Config {
  apiPort: number;
  dbAtlas: string | undefined;
  dbHost: string;
  dbName: string;
  dbPassword: string | undefined;
  dbPort: number;
  dbUser: string | undefined;
  jwtSecret: string;
  nodeEnv: string;
  twilioAccountSid: string | undefined;
  twilioAuthToken: string | undefined;
  twilioPhoneNumber: string | undefined;
  emailHost: string | undefined;
  emailPort: number | undefined;
  emailUser: string | undefined;
  emailPassword: string | undefined;
}
