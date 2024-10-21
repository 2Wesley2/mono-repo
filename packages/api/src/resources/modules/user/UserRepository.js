import Repository from '../../core/Repository.js';
import { USER } from '../../constants/index.js';

class UserRepository extends Repository {
  constructor(model) {
    super(model, USER);
  }
  async login(username, password) {
    try {
      return this.model.login(username, password);
    } catch (error) {
      throw new Error(`UserRepository.js: Erro ao fazer login no repositório: ${error.message}`);
    }
  }
}

export default UserRepository;
