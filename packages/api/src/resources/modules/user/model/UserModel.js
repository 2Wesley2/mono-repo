import Model from '#core/infrastructure/database/components/base/Model.js';
import { USER } from '../../../collections/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

export default class UserModel extends Model {
  constructor(schema = {}, modelName = USER, options = {}, middlewares = []) {
    const isSchemaEmpty = !schema || Object.keys(schema).length === 0;
    const combinedSchema = isSchemaEmpty ? userSchema : { ...userSchema, ...schema };
    super(combinedSchema, modelName, options, middlewares);
  }
}
