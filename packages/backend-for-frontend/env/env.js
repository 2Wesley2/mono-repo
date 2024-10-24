/*const requiredEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_NODE_ENV',
  'NEXT_PUBLIC_JWT_SECRET',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`A variável de ambiente ${envVar} é necessária.`);
  }
});*/

const environmentVariable =  {
  /**
   * URL base da API para o front-end
   * @type {string}
   */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

  /**
   * Ambiente da aplicação (produção, desenvolvimento, etc.)
   * @type {string}
   */
  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,

  /**
   * Token JWT para autenticação
   * @type {string}
   */
  jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET,
};

export default environmentVariable;