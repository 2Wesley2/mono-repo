import { InvalidRequestError, UnprocessableEntityError } from '../../../../errors/Exceptions.js';

class PayloadValidator {
  static validate(payload) {
    if (!payload) {
      throw new InvalidRequestError([{ field: 'payload', message: 'Payload is required' }], 'Token payload is missing');
    }

    if (typeof payload !== 'object' || Array.isArray(payload)) {
      throw new UnprocessableEntityError(
        [{ field: 'payload', message: 'Payload must be a non-array object' }],
        'Invalid payload format'
      );
    }

    const { id, role } = payload;
    if (!id || typeof id !== 'string') {
      throw new InvalidRequestError(
        [{ field: 'id', message: 'ID is required and must be a string' }],
        'Invalid or missing ID in payload'
      );
    }

    if (!role || typeof role !== 'string') {
      throw new InvalidRequestError(
        [{ field: 'role', message: 'Role is required and must be a string' }],
        'Invalid or missing role in payload'
      );
    }
    return true;
  }
}
export default {
  validate: (...args) => PayloadValidator.validate(...args)
};
