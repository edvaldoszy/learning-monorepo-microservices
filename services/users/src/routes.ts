import { Handler } from '@tinyhttp/app';
import { readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';

import createApp from './factories/app';
import authorizationMiddleware from './middlewares/authorizations';

const domainsRootDirectory = resolve(__dirname, 'domains');

const getFileAbsolutePath = (subdirectory: string) => join(domainsRootDirectory, subdirectory, 'routes');
const existsModule = (path: string) => existsSync(`${path}.ts`) || existsSync(`${path}.js`);

function requireModule(absolutePath: string) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(absolutePath).default || require(absolutePath);
}

export type Route = {
  public?: boolean
  internal?: boolean
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
  handlers: Handler[];
};

const routes: Route[] = readdirSync(domainsRootDirectory)
  .map(getFileAbsolutePath)
  .filter(existsModule)
  .flatMap(requireModule);

const api = createApp();
const internal = createApp();

routes.forEach(route => {
  const { method, path, handlers } = route;
  let middlewares: Handler[];

  if (route.public) {
    middlewares = handlers;
  } else {
    middlewares = [authorizationMiddleware, ...handlers];
  }

  if (route.internal) {
    internal[method](path, middlewares);
  } else {
    api[method](path, middlewares);
  }
});

internal.use('/api', api);

export default internal;
