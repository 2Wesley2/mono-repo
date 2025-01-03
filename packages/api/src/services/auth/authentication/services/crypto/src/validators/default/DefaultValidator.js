import { Validator } from '../../../../../../contracts/index.js';

export default class DefaultValidator extends Validator {
  validate(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('value deve ser uma string não vazia.');
    }
  }
}
