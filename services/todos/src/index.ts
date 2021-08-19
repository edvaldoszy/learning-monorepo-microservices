import '~/setup';
import { Job } from 'agenda';
import { createServer } from 'http';

import app from '~/app';
import mongo from '~/factories/mongo';

import appConfig from './config/app';
import agenda from './factories/agenda';

function onListening() {
  console.info(`Server started at http://localhost:${appConfig.port}`);
}

async function setup() {
  await mongo.connect();
  await agenda.start();

  agenda.define('TaskReminder', (job: Job) => {
    console.info(job.attrs.name);
    console.info(job.attrs.data);
  });
}

setup()
  .then(() => {
    createServer()
      .on('request', app.attach)
      .listen(appConfig.port, onListening);
  });
