import { Formatter } from '../../../../../contracts/index.js';

export default class JoseSecretKeyFormatter extends Formatter {
  constructor(base64SecretKeyValidator) {
    super();
    this.base64SecretKeyValidator = base64SecretKeyValidator;
  }
  format(secretKey) {
    this.base64SecretKeyValidator.validate(secretKey);
    return new Uint8Array(Buffer.from(secretKey, 'base64'));
  }
}
