import express from 'express';
import loaders from '../loaders/index.js';
import errorHandler from '../middlewares/errorHandler.js';

const app = express();


loaders.express.init(app);

app.get('/', (_, res) => res.json('Welcome to the SmartShop API'));

app.use(errorHandler);

export default app;
