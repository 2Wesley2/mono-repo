import loaders from '../../loaders/index.js';
class Model {
  constructor(schema, modelName) {
    this.model = loaders.mongoose.registerModel(schema, modelName);
    this.attachCustomMethods();
  }

  attachCustomMethods() {
    const customMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
      (method) => method !== 'constructor' && typeof this[method] === 'function',
    );

    customMethods.forEach((method) => {
      this.model[method] = this[method].bind(this);
    });
  }
}

export default Model;
