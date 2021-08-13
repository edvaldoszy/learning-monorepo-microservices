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
];

export default routes;
