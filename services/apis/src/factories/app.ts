import { App } from '@tinyhttp/app';

import { errorMiddleware, notFoundMiddleware } from '~/middlewares/errors';

function createApp() {
  return new App({
    onError: errorMiddleware,
    noMatchHandler: notFoundMiddleware,
  });
}

export default createApp;
