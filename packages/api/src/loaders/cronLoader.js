import CronJobManager from '../job/index.js';

const cronJobManager = new CronJobManager();

export default {
  scheduleJob: (jobName, schedule, task) => cronJobManager.scheduleJob(jobName, schedule, task),
  cancelJob: (jobName) => cronJobManager.cancelJob(jobName),
  listJobs: () => cronJobManager.listJobs(),
};
