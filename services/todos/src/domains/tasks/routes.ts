import queriesMiddleware from '~/middlewares/queries';
import { Route } from '~/routes';

import controllers from './controllers';

const routes: Route[] = [
  {
    method: 'post',
    path: '/todos/tasks',
    handlers: [
      controllers.create,
    ],
  },
  {
    method: 'put',
    path: '/todos/tasks/:taskId',
    handlers: [
      controllers.update,
    ],
  },
  {
    method: 'get',
    path: '/todos/tasks',
    handlers: [
      queriesMiddleware,
      controllers.find,
    ],
  },
  {
    method: 'get',
    path: '/todos/tasks/:taskId',
    handlers: [
      controllers.get,
    ],
  },
  {
    method: 'delete',
    path: '/todos/tasks/:taskId',
    handlers: [
      controllers.remove,
    ],
  },
];

export default routes;
