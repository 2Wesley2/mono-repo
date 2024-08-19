import listEndpoints from 'express-list-endpoints';

export const listServerEndpoints = (app) => {
  const endpoints = listEndpoints(app);
  console.log('Endpoints configurados:');
  endpoints.forEach((endpoint) => {
    console.log(`${endpoint.methods.join(', ')} ${endpoint.path}`);
  });
};
