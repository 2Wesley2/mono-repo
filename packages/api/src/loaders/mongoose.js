import Database from '../database/index.js';

export default {
  init: Database.connect,
  disconnect: Database.disconnect,
  registerModel: () => Database.registerModel,
  getTypes: () => Database.Types,
  getObjectId: () => Database.ObjectId,
  isValidObjectId: () => Database.isValidObjectId,
};
