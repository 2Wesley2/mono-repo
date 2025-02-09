import cron from 'node-cron';
import debug from '../debug/index.js';

export default class CronJobManager {
  constructor() {
    this.jobs = {};
  }

  /**
   * Agenda uma nova tarefa.
   * @param {string} jobName - Nome da tarefa.
   * @param {string} schedule - Cron schedule (ex: '0 0 * * *' para meia-noite todos os dias).
   * @param {Function} task - Função a ser executada na hora agendada.
   */
  scheduleJob(jobName, schedule, task) {
    if (this.jobs[jobName]) {
      debug.logger.warn(`CronJobManager: Tarefa '${jobName}' já existe. Cancelando a tarefa antiga e re-agendando.`);
      this.cancelJob(jobName);
    }

    const job = cron.schedule(schedule, task, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    });

    this.jobs[jobName] = job;
    debug.logger.info(`CronJobManager: Tarefa '${jobName}' agendada com sucesso para '${schedule}'`);
  }

  /**
   * Cancela uma tarefa agendada.
   * @param {string} jobName - Nome da tarefa.
   */
  cancelJob(jobName) {
    if (this.jobs[jobName]) {
      this.jobs[jobName].stop();
      delete this.jobs[jobName];
      debug.logger.info(`CronJobManager: Tarefa '${jobName}' foi cancelada.`);
    } else {
      debug.logger.warn(`CronJobManager: Tarefa '${jobName}' não encontrada para cancelamento.`);
    }
  }

  /**
   * Lista todas as tarefas agendadas.
   * @returns {Array<string>} - Nomes das tarefas agendadas.
   */
  listJobs() {
    return Object.keys(this.jobs);
  }
}
