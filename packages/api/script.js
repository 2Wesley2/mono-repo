import { randomBytes } from 'crypto';

function generateSecretKey() {
  const key = randomBytes(32); // Gera 32 bytes aleatórios
  return key.toString('base64'); // Converte para base64
}

const secretKey = generateSecretKey();
console.log('Chave secreta de 32 bytes (base64):', secretKey);
