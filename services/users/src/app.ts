import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { json } from 'body-parser';

import errorsMiddleware from './middlewares/errors';
import routes from './routes';

const app = new App({ onError: errorsMiddleware });
app.use(logger());
app.use(json({ strict: true }));
app.use(routes as App);

export default app;
