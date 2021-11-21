import queriesMiddleware from '~/middlewares/queries';
import { Route } from '~/routes';

import controllers from './controllers';

const routes: Route[] = [
  {
    method: 'post',
    path: '/todos/lists',
    handlers: [
      controllers.create,
    ],
  },
  {
    method: 'put',
    path: '/todos/lists/:listId',
    handlers: [
      controllers.update,
    ],
  },
  {
    method: 'get',
    path: '/todos/lists',
    handlers: [
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    method: 'get',
    path: '/todos/lists/:listId',
    handlers: [
      controllers.get,
    ],
  },
  {
    method: 'delete',
    path: '/todos/lists/:listId',
    handlers: [
      controllers.remove,
    ],
  },
];

export default routes;
