export default class Password {
  static validate(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password deve ser uma string não vazia.');
    }
  }
}
