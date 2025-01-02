import { DefaultPayloadValidator } from '../default/index.js';
import { InvalidRequestError } from '../../../../../../../../errors/Exceptions.js';

export default class UserPayloadValidator extends DefaultPayloadValidator {
  validate(payload) {
    super.validate(payload);
    const { id, role } = payload;

    if (!id || typeof id !== 'string') {
      throw new InvalidRequestError(
        [{ field: 'id', message: 'ID is required and must be a string' }],
        'Invalid or missing ID in payload',
      );
    }

    if (!role || typeof role !== 'string') {
      throw new InvalidRequestError(
        [{ field: 'role', message: 'Role is required and must be a string' }],
        'Invalid or missing role in payload',
      );
    }
  }
}
