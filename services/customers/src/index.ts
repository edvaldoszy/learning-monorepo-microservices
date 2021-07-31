import '~/setup';
import { createServer } from 'http';

import app from '~/app';
import appConfig from './config/app';

function onListening() {
  console.log(`Server started at http://localhost:${appConfig.port}`);
}

createServer()
  .on('request', app.attach)
  .listen(appConfig.port, onListening);
