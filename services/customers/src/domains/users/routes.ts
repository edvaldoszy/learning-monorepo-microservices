import { Route } from '~/routes';

import controllers from './controllers';

const routes: Route[] = [
  {
    method: 'get',
    path: '/users',
    handlers: [
      controllers.find,
    ],
  },
];

export default routes;
