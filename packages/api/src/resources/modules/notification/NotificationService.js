import twilio from 'twilio';
import nodemailer from 'nodemailer';
import config from '../../../config/index.js';
import debug from '../../../debug/index.js';

const { twilioAccountSid, twilioAuthToken, twilioPhoneNumber, emailHost, emailPort, emailUser, emailPassword } = config;

class NotificationService {
  constructor(notificationRepository) {
    debug.logger.info('NotificationService.js: Iniciando NotificationService');
    this.notificationRepository = notificationRepository;
    this.twilioClient = twilio(twilioAccountSid, twilioAuthToken);

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }

  async register(data) {
    try {
      const notification = await this.notificationRepository.register(data);
      debug.logger.info('NotificationService.js: Notificação registrada com sucesso.');
      return notification;
    } catch (error) {
      debug.logger.error('NotificationService.js: Erro ao registrar notificação.', error);
      throw error;
    }
  }

  async sendWhatsApp(numero, mensagem) {
    debug.logger.info(`NotificationService.js: Preparando para enviar WhatsApp para ${numero}`);
    try {
      await this.twilioClient.messages.create({
        body: mensagem,
        from: `whatsapp:${twilioPhoneNumber}`,
        to: `whatsapp:${numero}`,
      });
      debug.logger.info('NotificationService.js: Notificação enviada via WhatsApp.');
      return 'whatsapp: enviado';
    } catch (error) {
      debug.logger.error('NotificationService.js: Erro ao enviar WhatsApp:', error);
      return 'whatsapp: erro';
    }
  }

  async sendSMS(numero, mensagem) {
    debug.logger.info(`NotificationService.js: Preparando para enviar SMS para ${numero}`);
    try {
      await this.twilioClient.messages.create({
        body: mensagem,
        from: twilioPhoneNumber,
        to: numero,
      });
      debug.logger.info('NotificationService.js: Notificação enviada via SMS.');
      return 'sms: enviado';
    } catch (error) {
      debug.logger.error('NotificationService.js: Erro ao enviar SMS:', error);
      return 'sms: erro';
    }
  }

  async sendEmail(destinatario, assunto, mensagem) {
    debug.logger.info(
      `NotificationService.js: Preparando para enviar E-mail para ${destinatario} com o assunto '${assunto}'`,
    );
    try {
      await this.transporter.sendMail({
        from: emailUser,
        to: destinatario,
        subject: assunto,
        text: mensagem,
      });
      debug.logger.info('NotificationService.js: Notificação enviada via E-mail.');
      return 'email: enviado';
    } catch (error) {
      debug.logger.error('NotificationService.js: Erro ao enviar E-mail:', error);
      return 'email: erro';
    }
  }

  async sendToAllChannels(cliente, mensagem) {
    debug.logger.info('NotificationService.js: Iniciando envio para todos os canais');

    const resultados = {
      whatsapp: cliente.whatsapp ? await this.sendWhatsApp(cliente.whatsapp, mensagem) : 'whatsapp: não configurado',
      sms: cliente.telefone ? await this.sendSMS(cliente.telefone, mensagem) : 'sms: não configurado',
      email: cliente.email
        ? await this.sendEmail(cliente.email, 'Notificação de Ticket', mensagem)
        : 'email: não configurado',
    };

    debug.logger.info('Concluído o envio para todos os canais');
    return resultados;
  }
}
export default NotificationService;
