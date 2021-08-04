import { Route } from '~/routes';

import controllers from './controllers';

const routes: Route[] = [
  {
    method: 'post',
    path: '/users/login',
    handlers: [
      controllers.login,
    ],
  },
];

export default routes;
