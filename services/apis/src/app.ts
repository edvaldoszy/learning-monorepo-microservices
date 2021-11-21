import { logger } from '@tinyhttp/logger';
import { json as parseJSON } from 'body-parser';

import createApp from './factories/app';
import graphql from './graphql';
import routes from './routes';

const app = createApp();
app.use(logger());
app.use(parseJSON({ strict: true }));
app.use('/graphql', graphql);
app.use(routes);

export default app;
