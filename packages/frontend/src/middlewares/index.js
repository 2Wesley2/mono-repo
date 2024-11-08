import TokenValidator from './TokenValidator';
import TokenSigner from './TokenSigner';
import RoleExtractor from './RoleExtractor';
import AccessController from './AccessController';
import env from '../env/index';

const getValidEncryptionKey = (secret) => {
  const decodedKey = Buffer.from(secret, 'base64');
  if (decodedKey.length !== 32) {
    throw new Error(
      'A chave decodificada deve ter exatamente 32 bytes (256 bits) para HS256',
    );
  }
  return new Uint8Array(decodedKey);
};

const secret = getValidEncryptionKey(env.jwtSecret);
const tokenValidator = new TokenValidator(secret);
const tokenSigner = new TokenSigner(tokenValidator);
const roleExtractor = new RoleExtractor(tokenValidator);
const accessController = new AccessController(
  tokenValidator,
  roleExtractor,
  tokenSigner,
);

export default accessController;
