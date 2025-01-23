import UserModel from '../base/UserModel.js';

import { OWNER_USER, ROLE } from '../../../collections/index.js';

const ownerUserSchema = {
  role: { type: UserModel.objectIdType, ref: ROLE, required: true },
};

export default class OwnerUserModel extends UserModel {
  constructor() {
    super(ownerUserSchema, OWNER_USER);
  }
}
