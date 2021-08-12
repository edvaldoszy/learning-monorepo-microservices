import '~/setup';
import { createServer } from 'http';

import app from '~/app';
// import mongo from '~/factories/mongo';

import appConfig from './config/app';

function onListening() {
  console.info(`Server started at http://localhost:${appConfig.port}`);
}

// async function setup() {
//   await mongo.connect();
// }

// setup()
//   .then(() => {
createServer()
  .on('request', app.attach)
  .listen(appConfig.port, onListening);
// });
