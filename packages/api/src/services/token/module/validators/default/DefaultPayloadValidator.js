import { Validator } from '../../../module/contracts/index.js';
import { InvalidRequestError, UnprocessableEntityError } from '../../../../../errors/Exceptions.js';

export default class DefaultPayloadValidator extends Validator {
  validate(payload) {
    if (!payload) {
      throw new InvalidRequestError([{ field: 'payload', message: 'Payload is required' }], 'Token payload is missing');
    }

    if (typeof payload !== 'object' || Array.isArray(payload)) {
      throw new UnprocessableEntityError(
        [{ field: 'payload', message: 'Payload must be a non-array object' }],
        'Invalid payload format',
      );
    }
  }
}
