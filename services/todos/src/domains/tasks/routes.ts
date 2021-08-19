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
];

export default routes;
