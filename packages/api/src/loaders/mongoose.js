import Database from '../database/index.js';

export default {
  init: Database.connect,
  disconnect: Database.disconnect,
  registerModel: (schema, modelName, options = {}) => Database.registerModel({ schema, modelName, options }),
  getTypes: () => Database.Types,
  getObjectId: () => Database.ObjectId,
  isValidObjectId: () => Database.isValidObjectId,
};
