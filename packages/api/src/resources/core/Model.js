import loaders from '../../loaders/index.js';
class Model {
  constructor(schema, modelName) {
    this.model = loaders.mongoose.registerModel(schema, modelName);
    this.modelName = modelName;
  }
}

export default Model;
