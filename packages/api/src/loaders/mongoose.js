import Database from '../database/index.js';

export default {
  init: Database.connect,
  disconnect: Database.disconnect,
};
