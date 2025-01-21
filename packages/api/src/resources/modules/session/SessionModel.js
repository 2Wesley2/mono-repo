import Model from '../../../core/entities/system/base/Model.js';
import { SESSION, USER } from '../../collections/index.js';
import loaders from '../../../core/loaders/index.js';

const statusValues = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
});

const statusEnum = Object.values(statusValues);

const sessionSchema = {
  user: { type: Mode.objectIdType(), ref: USER, required: true },
  status: { type: String, enum: statusEnum, default: statusValues.ACTIVE },
};

export default class Session extends Model {
  constructor() {
    super(sessionSchema, SESSION);
  }
}
