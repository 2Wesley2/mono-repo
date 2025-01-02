import Database from '../../../database/index.js';
import Model from '../../components/Model.js';
import debug from '../../../debug/index.js';
import { NOTIFICATION, TICKET, CUSTOMER, SALE } from '../../constants/index.js';

const notificationSchema = {
  ticket: { type: Database.ObjectId, ref: TICKET, required: true },
  customer: { type: Database.ObjectId, ref: CUSTOMER, required: true },
  sale: { type: Database.ObjectId, ref: SALE, required: false },
  dataEnvio: { type: Date },
  mensagem: { type: String, required: true },
};

class NotificationModel extends Model {
  constructor() {
    super(notificationSchema, NOTIFICATION);
  }
  async register(data) {
    try {
      const notification = await this.model.create(data);
      debug.logger.info('NotificationModel: Notificação registrada com sucesso.');
      return notification;
    } catch (error) {
      debug.logger.error('NotificationModel: Erro ao registrar notificação.', error);
      throw error;
    }
  }
}
export default NotificationModel;
