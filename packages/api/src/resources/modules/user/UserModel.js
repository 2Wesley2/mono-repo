import Model from '../../core/Model.js';
import { USER } from '../../constants/index.js';

const userSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
};
class UserModel extends Model {
  constructor() {
    super(userSchema, USER);
  }

  async create(data) {
    const { username, password, role } = data;
    const user = new UserModel({ username, password, role });
    await user.save();
    const token = this.generateToken(user);
    return { user, token };
  }
}

export default UserModel;
