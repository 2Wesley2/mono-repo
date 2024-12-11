import Model from '../../core/Model.js';
import loaders from '../../../loaders/index.js';
import { REWARD, CUSTOMER } from '../../constants/index.js';

const rewardSchema = {
  customerId: { type: loaders.mongoose.getObjectId(), ref: CUSTOMER, unique: true, required: true },
  points: { type: Number, required: true, default: 0 },
  cash: { type: Number, required: true, default: 0 },
};

class RewardModel extends Model {
  constructor() {
    super(rewardSchema, REWARD);
  }

  async createReward(customerId) {
    return await this.model.create({ customerId, points: 0, cash: 0 });
  }

  async getRewardByCustomerId(customerId) {
    return await this.model.findOne({ customerId });
  }

  async updateRewardByCustomerId(customerId, updatedData) {
    return await this.model.findOneAndUpdate({ customerId }, updatedData, { new: true });
  }
}

export default RewardModel;
