import Repository from '../../core/Repository.js';
import { USER } from '../../constants/index.js';

class UserRepository extends Repository {
  constructor(model) {
    super(model, USER);
  }
}

export default UserRepository;
