import { DefaultArgsValidator } from '../default/index.js';
import loaders from '../../../../../loaders/index.js';

export default class UserValidator extends DefaultArgsValidator {
  validate(userID) {
    super.validate(userID);
    if (!loaders.mongoose.isValidObjectId(userID)) {
      throw new Error(`Invalid userID format: ${userID}`);
    }
  }
}
