import loaders from '../loaders/index.js';
import { listServerEndpoints } from '../helpers/listEndpointsHelper.js';

export default async (expressApp, port = 3000) => {
  loaders.mongoose.init();
  expressApp.listen(port, () => {
    listServerEndpoints(expressApp);
  });
};
