import listEndpoints from 'express-list-endpoints';
/**
 * Lista e exibe todos os endpoints do servidor em desenvolvimento.
 *
 * @function listServerEndpoints
 * @param {import('express').Application} app - A instância do aplicativo Express cujos endpoints serão listados.
 * @returns {void} Esta função não retorna nenhum valor.
 *
 * @example
 * import express from 'express';
 * import { listServerEndpoints } from './listEndpoints';
 *
 * const app = express();
 *
 * app.get('/', (req, res) => res.send('Hello World'));
 *
 * Listar endpoints se estiver em desenvolvimento
 * listServerEndpoints(app);
 */
export const listServerEndpoints = (app) => {
  // Verifica se o ambiente é desenvolvimento
  if (process.env.NODE_ENV !== 'development') return;

  /**
   * Itera sobre cada endpoint e exibe no console o método HTTP e o caminho.
   * @callback endpointIterator
   * @param {Object} endpoint - O objeto que representa um endpoint do Express.
   * @param {string[]} endpoint.methods - Lista dos métodos HTTP associados ao endpoint.
   * @param {string} endpoint.path - O caminho do endpoint.
   */
  const endpoints = listEndpoints(app);
  endpoints.forEach((endpoint) => {
    console.log(`${endpoint.methods.join(', ')} ${endpoint.path}`);
  });
};
