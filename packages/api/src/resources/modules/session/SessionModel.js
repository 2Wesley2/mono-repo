import Model from '../../components/Model.js';
import { SESSION, USER } from '../../constants/index.js';
import loaders from '../../../loaders/index.js';

const statusValues = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
});

const statusEnum = Object.values(statusValues);

const sessionSchema = {
  user: { type: loaders.mongoose.getObjectId(), ref: USER, required: true },
  status: { type: String, enum: statusEnum, default: statusValues.ACTIVE },
};

export default class Session extends Model {
  constructor() {
    super(sessionSchema, SESSION);
  }
}
