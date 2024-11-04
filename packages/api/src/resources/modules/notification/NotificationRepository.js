import debug from '../../../debug/index.js';

class NotificationRepository {
  constructor(notificationModel) {
    this.notificationModel = notificationModel;
  }

  async register(data) {
    try {
      const notification = await this.notificationModel.register(data);
      debug.logger.info('NotificationRepository: Notificação registrada com sucesso.');
      return notification;
    } catch (error) {
      debug.logger.error('NotificationRepository: Erro ao registrar notificação.', error);
      throw error;
    }
  }
}

export default NotificationRepository;
