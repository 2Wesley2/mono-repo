import listEndpoints from 'express-list-endpoints';

export const listServerEndpoints = (app) => {
  if (process.env.NODE_ENV !== 'development') return;
  const endpoints = listEndpoints(app);
  endpoints.forEach((endpoint) => {
    console.log(`${endpoint.methods.join(', ')} ${endpoint.path}`);
  });
};
