import { Validator } from '../../../module/contracts/index.js';

export default class DefaultSecretKeyValidator extends Validator {
  validate(secretKey) {
    if (!secretKey || typeof secretKey !== 'string') {
      throw new Error('A chave secreta deve ser uma string não vazia.');
    }
  }
}
