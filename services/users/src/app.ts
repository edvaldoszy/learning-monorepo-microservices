import { logger } from '@tinyhttp/logger';
import { json } from 'body-parser';

import createApp from './factories/app';
import routes from './routes';

const app = createApp();
app.use(logger());
app.use(json({ strict: true }));
app.use(routes);

export default app;
