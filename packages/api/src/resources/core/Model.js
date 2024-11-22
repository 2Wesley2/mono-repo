import loaders from '../../loaders/index.js';
import debug from '../../debug/index.js';

class Model {
  constructor(schema, modelName) {
    this.model = loaders.mongoose.registerModel(schema, modelName);
    this.attachCustomMethods();
    debug.logger.debug(`Model: Initialized with schema for ${modelName}`);
  }

  attachCustomMethods() {
    const customMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
      (method) => method !== 'constructor' && typeof this[method] === 'function',
    );

    customMethods.forEach((method) => {
      this.model[method] = this[method].bind(this);
    });

    debug.logger.debug(`Model: Custom methods attached: ${customMethods.join(', ')}`);
  }
}

export default Model;
