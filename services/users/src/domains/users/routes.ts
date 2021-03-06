import queriesMiddleware from '~/middlewares/queries';
import { Route } from '~/routes';

import controllers from './controllers';

const routes: Route[] = [
  {
    public: true,
    method: 'post',
    path: '/users/register',
    handlers: [
      controllers.register,
    ],
  },
  {
    public: true,
    method: 'post',
    path: '/users/login',
    handlers: [
      controllers.login,
    ],
  },
  {
    method: 'put',
    path: '/users/login',
    handlers: [
      controllers.refresh,
    ],
  },

  {
    public: true,
    method: 'get',
    path: '/users',
    handlers: [
      queriesMiddleware,
      controllers.list,
    ],
  },
];

export default routes;
