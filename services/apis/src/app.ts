import { logger } from '@tinyhttp/logger';
import { json as parseJSON } from 'body-parser';

import createApp from './factories/app';
import createGraphQL from './factories/graphql';
import routes from './routes';

async function configureApp() {
  const app = createApp();
  const graphql = await createGraphQL('domains/**/schema.{js,ts}', __dirname);

  app.use(logger());
  app.use(parseJSON({ strict: true }));
  app.use('/graphql', graphql);
  app.use(routes);

  return app;
}

export default configureApp;
