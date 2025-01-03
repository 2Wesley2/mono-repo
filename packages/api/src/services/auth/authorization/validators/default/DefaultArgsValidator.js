import { Validator } from '../../../contracts/index.js';

export default class DefaultArgsValidator extends Validator {
  validate(args) {
    if (!args || typeof args !== 'string') {
      throw new Error('A chave secreta deve ser uma string não vazia.');
    }
  }
}
