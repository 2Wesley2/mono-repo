import Database from '../../../database/index.js';
import Model from '../../core/Model.js';
import debug from '../../../debug/index.js';
import { NOTIFICATION, TICKET, CUSTOMER, SALES } from '../../constants/index.js';

const notificationSchema = {
  ticket: { type: Database.ObjectId, ref: TICKET, required: true },
  customer: { type: Database.ObjectId, ref: CUSTOMER, required: true },
  sale: { type: Database.ObjectId, ref: SALES, required: false },
  dataExpiracao: { type: Date, required: true },
  status: { type: String, enum: ['ativo', 'usado', 'expirado'], default: 'ativo' },
  dataEnvio: { type: Date },
  canal: { type: String, enum: ['email', 'sms', 'whatsapp'], required: true },
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
