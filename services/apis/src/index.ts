import '~/setup';
import { createServer } from 'http';

import configureApp from '~/app';

import appConfig from './config/app';

function onListening() {
  console.info(`Server started at http://localhost:${appConfig.port}`);
}

configureApp().then(app => {
  createServer()
    .on('request', app.attach)
    .listen(appConfig.port, onListening);
});
