import ClientConfig from '../models/ClientConfig.js';

export default class Singleton {
  static instance = null;

  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new ClientConfig();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}
